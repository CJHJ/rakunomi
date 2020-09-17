import React, { Component, useState, useEffect } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";

import AuthService from "../../services/auth.service";
import MeetingService from "../../services/meeting.service";

import "./css/CreateMeeting.css";

export default function EditMeeting() {
  const location = useLocation();
  const history = useHistory();
  if (!location.state) {
    history.push("/Home");
    window.location.reload();
  }
  const { meeting } = location.state;
  console.log(meeting);

  const currentUser = AuthService.getCurrentUser();

  // Get meeting info
  const [meetingInfo, setMeetingInfo] = useState({});
  const updateMeetingInfo = (data) => {
    setMeetingInfo((old) => {
      setParticipantList((old) => {
        return data.data.invited_username;
      });
      return data.data;
    });
  };

  const [dateTimeValue, onDateTimeChange] = useState(
    moment(meeting.datetime, "YYYY-MM-DD HH:mm").toDate()
  );
  const [participantList, setParticipantList] = useState(new Array());

  // Handlers
  // -- Meeting name
  const [meetingName, setMeetingName] = useState(meeting.meeting_name);

  // -- Participants
  const [participantLoading, setParticipantLoading] = useState(false);
  const [participantMessage, setParticipantMessage] = useState("");
  const [participantName, setParticipantName] = useState("");
  const handleAddParticipant = () => {
    setParticipantMessage("");
    setParticipantLoading(true);
    MeetingService.searchUser(participantName).then(
      (data) => {
        const tempUser = {
          user_id: data.user_id,
          user_name: participantName,
        };

        setParticipantList((oldList) => {
          const usernameFound = oldList.some(
            (el) => el.user_name === participantName
          );
          if (!usernameFound) {
            return [...oldList, tempUser];
          }

          setParticipantMessage("User already exists!");
          return oldList;
        });

        setParticipantLoading(false);
      },
      (error) => {
        console.log(error.response);
        const resMessage =
          (error.response && error.response.data && error.response.data.msg) ||
          error.message ||
          error.toString();

        setParticipantLoading(false);
        setParticipantMessage(resMessage);
      }
    );
  };
  const handleDeleteParticipant = (e) => {
    const username = e.currentTarget.dataset.username;
    console.log(username);
    setParticipantList((oldList) => {
      return oldList.filter((el) => el.user_name != username);
    });
  };

  // -- Wishlist related
  const [wishlist, setWishlist] = useState(new Array());
  const [isWishlistShown, setIsWishlistShown] = useState(false);
  const [wishlistPrice, setWishlistPrice] = useState(0);
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };
  const toggleWishlist = () => {
    setIsWishlistShown((oldState) => {
      return oldState ? false : true;
    });
  };
  const calculatePrice = () => {
    setWishlistPrice(() => {
      return wishlist.reduce((a, b) => +a + +b.price, 0);
    });
  };
  const deleteItem = (e) => {
    const index = e.currentTarget.dataset.index;

    setWishlist((tempWishlist) => {
      tempWishlist.splice(index, 1);
      return [...tempWishlist];
    });
  };
  const populateWishlist = (meetingId) => {
    const newWishlist = MeetingService.getWishlist(meetingId).then((data) => {
      const getWishlist = async () => {
        return Promise.all(
          data.data.map(async (el) => {
            const productInfo = await MeetingService.getProductInfo(
              el.product_id
            ).then(
              (data) => {
                console.log(data);
                // if (typeof data.item === "undefined") {
                //   window.location.reload();
                // }
                return data.item;
              },
              (error) => {
                console.log(error.response);
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.msg) ||
                  error.message ||
                  error.toString();
              }
            );

            return productInfo;
          })
        );
      };

      getWishlist().then((tempWishlist) => {
        setWishlist(() => {
          console.log("Updated wishlist!");
          console.log(tempWishlist);
          return tempWishlist;
        });
      });
    });
  };

  // -- Search Item
  const [searchItemLoading, setSearchItemLoading] = useState(false);
  const [searchItemMessage, setSearchItemMessage] = useState("");
  const [searchItemName, setSearchItemName] = useState("");
  const [searchedItems, setSearchedItems] = useState(new Array());
  const handleSearchItem = () => {
    setSearchItemMessage("");
    setSearchItemLoading(true);
    MeetingService.searchItem(searchItemName).then(
      (data) => {
        setSearchedItems(() => {
          return data.items;
        });
        setSearchItemLoading(false);
      },
      (error) => {
        console.log(error.response);
        const resMessage =
          (error.response && error.response.data && error.response.data.msg) ||
          error.message ||
          error.toString();

        setSearchItemLoading(false);
        setSearchItemMessage(resMessage);
      }
    );

    handleRecommendItem();
  };
  const handleAddItem = (e) => {
    const index = e.currentTarget.dataset.index;
    setWishlist((oldWishlist) => {
      console.log(oldWishlist);
      return [...oldWishlist, searchedItems[index]];
    });
  };

  // -- Recommendation Item
  const [recommendItemLoading, setRecommendItemLoading] = useState(false);
  const [recommendItemMessage, setRecommendItemMessage] = useState("");
  const [recommendedItems, setRecommendedItems] = useState(new Array());
  const handleRecommendItem = () => {
    setRecommendItemMessage("");
    setRecommendItemLoading(true);
    MeetingService.recommendItem().then(
      (data) => {
        setRecommendedItems(() => {
          return data.item;
        });
        setRecommendItemLoading(false);
      },
      (error) => {
        console.log(error.response);
        const resMessage =
          (error.response && error.response.data && error.response.data.msg) ||
          error.message ||
          error.toString();

        setRecommendItemLoading(false);
        setRecommendItemMessage(resMessage);
      }
    );
  };
  const handleAddRecommendedItem = (e) => {
    const index = e.currentTarget.dataset.index;
    setWishlist((oldWishlist) => {
      console.log(oldWishlist);
      return [...oldWishlist, recommendedItems[index]];
    });
  };

  const handleSubmit = (e) => {
    MeetingService.confirmMeeting(meeting.meeting_id).then(() => {
      history.push("/meetings");
    });
  };

  const handleSave = () => {
    MeetingService.updateWishlist(meeting.meeting_id, wishlist).then(() => {
      window.location.reload();
    });
  };

  const handleUpdate = () => {
    MeetingService.updateMeeting(
      meeting.meeting_id,
      meetingName,
      moment(dateTimeValue).format("YYYY-MM-DD HH:mm")
    ).then(() => {
      history.push("/meetings");
    });
  };

  // Run on mount
  useEffect(() => {
    MeetingService.getMeetingInfo(meeting.meeting_id).then(
      (data) => {
        updateMeetingInfo(data);
      },
      (error) => {
        console.log(error.response);
        const resMessage =
          (error.response && error.response.data && error.response.data.msg) ||
          error.message ||
          error.toString();

        console.log(resMessage);
      }
    );

    populateWishlist(meeting.meeting_id);
  }, []);

  // Run on wishlist change
  useEffect(() => {
    calculatePrice();
  }, [wishlist]);

  return (
    <Container className="main-meeting-container">
      <h1>Edit Meeting</h1>
      <Form>
        <Card>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Meeting Name</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Meeting name"
                  onChange={(e) => setMeetingName(e.target.value)}
                  value={meetingName}
                  disabled={meeting.leader_username != currentUser.user_name}
                />
              </Col>
            </Row>
          </Form.Group>
          {/* Time schedule */}
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Time schedule</Form.Label>
              </Col>
              <Col>
                <DateTimePicker
                  onChange={onDateTimeChange}
                  value={dateTimeValue}
                  disabled={meeting.leader_username != currentUser.user_name}
                />
              </Col>
            </Row>
          </Form.Group>
          {/* Select participants */}
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Selected participants</Form.Label>
                <ol>
                  {participantList.map((participant) => {
                    return participant == meeting.leader_username ? (
                      <li key={participant}>
                        <b>{participant}</b> (leader)
                      </li>
                    ) : (
                      <li key={participant}>{participant}</li>
                    );
                  })}
                </ol>
              </Col>
            </Row>
          </Form.Group>
          {/* Wishlist */}
          <section className="wishlist-container">
            <Row>
              <Col>
                <h5>Wishlist</h5>
              </Col>

              <Col>{wishlist.length} items</Col>
              <Col>Total price: {wishlistPrice}円</Col>
              <Col>
                Price/1 person:{" "}
                {participantList.length == 0
                  ? "N/A"
                  : Math.ceil(wishlistPrice / participantList.length) + "円"}
              </Col>
              <Col>
                <Button
                  className="wishlist-showhide"
                  variant="primary"
                  onClick={toggleWishlist}
                >
                  {isWishlistShown ? "Hide" : "Show"}
                </Button>
              </Col>
            </Row>

            {isWishlistShown && (
              <Slider {...sliderSettings}>
                {wishlist.map((item, index) => {
                  return (
                    <div key={index}>
                      <Card className="wishlist-card">
                        <div className="wishlist-image">
                          <img
                            src={item.image_URLs[0].imageUrl}
                            alt="First slide"
                          />
                        </div>
                        <div className="wishlist-text">{item.item_name}</div>
                        <div className="wishlist-text">
                          {"Price: " + item.price + "円"}
                        </div>
                        <div className="wishlist-text">
                          {"Review: " +
                            (item.review != "0" ? item.review : "N/A")}
                        </div>
                        <Button
                          className="delete-user-button"
                          variant="danger"
                          data-index={index}
                          onClick={deleteItem}
                        >
                          -
                        </Button>
                      </Card>
                    </div>
                  );
                })}
              </Slider>
            )}
          </section>
          {/* Search item */}
          <section className="search-item-container">
            <Row>
              <Col>
                <Form.Label>Search item</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="item name"
                      onChange={(e) => setSearchItemName(e.target.value)}
                      value={searchItemName}
                    />
                  </Col>
                  <Col>
                    <Button
                      variant="primary"
                      onClick={handleSearchItem}
                      disabled={searchItemLoading}
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  {searchItemMessage && (
                    <div className="alert alert-danger" role="alert">
                      {searchItemMessage}
                    </div>
                  )}
                </div>
                <Slider {...sliderSettings}>
                  {searchedItems.map((item, index) => {
                    return (
                      <div key={index}>
                        <Card className="wishlist-card">
                          <div className="wishlist-image">
                            <img
                              src={item.image_URLs[0].imageUrl}
                              alt="First slide"
                            />
                          </div>
                          <div className="wishlist-text">{item.item_name}</div>
                          <div className="wishlist-text">
                            {"Price: " + item.price + "円"}
                          </div>
                          <div className="wishlist-text">
                            {"Review: " +
                              (item.review != "0" ? item.review : "N/A")}
                          </div>
                          <div>
                            <Button
                              data-index={index}
                              variety="primary"
                              onClick={handleAddItem}
                            >
                              Add
                            </Button>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </Slider>
              </Col>
            </Row>
            {/* Recommended item */}
            <Row>
              <Col>
                <Form.Label>Recommendations</Form.Label>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  {recommendItemMessage && (
                    <div className="alert alert-danger" role="alert">
                      {recommendItemMessage}
                    </div>
                  )}
                </div>
                <Slider {...sliderSettings}>
                  {recommendedItems.map((item, index) => {
                    return (
                      <div key={index}>
                        <Card className="wishlist-card">
                          <div className="wishlist-image">
                            <img src={item.image_URLs[0].imageUrl} />
                          </div>
                          <div className="wishlist-text">{item.item_name}</div>
                          <div className="wishlist-text">
                            {"Price: " + item.price + "円"}
                          </div>
                          <div className="wishlist-text">
                            {"Review: " +
                              (item.review != "0" ? item.review : "N/A")}
                          </div>
                          <div>
                            <Button
                              data-index={index}
                              variety="primary"
                              onClick={handleAddRecommendedItem}
                            >
                              Add
                            </Button>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </Slider>
              </Col>
            </Row>
          </section>
          {/* Submit button! */}
          <Row>
            <Col>
              <Button variety="primary" onClick={handleSave}>
                Save
              </Button>
            </Col>
            {!(meeting.leader_username == currentUser.user_name) && (
              <Col>
                <Button variety="primary" onClick={handleSubmit}>
                  Accept!
                </Button>
              </Col>
            )}
            {meeting.leader_username == currentUser.user_name && (
              <Col>
                <Button variety="primary" onClick={handleUpdate}>
                  Save meeting info
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      </Form>
    </Container>
  );
}
