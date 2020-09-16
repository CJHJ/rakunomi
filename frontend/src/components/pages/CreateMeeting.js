import React, { Component, useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Tabs,
  Tab,
  Modal,
  Image,
  Button,
  Carousel,
} from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";

import AuthService from "../../services/auth.service";
import MeetingService from "../../services/meeting.service";

import "./css/CreateMeeting.css";

export default function CreateMeeting() {
  const currentUser = AuthService.getCurrentUser();

  const [dateTimeValue, onDateTimeChange] = useState(new Date());
  const [participantList, setParticipantList] = useState(
    new Array(currentUser)
  );

  // Handlers
  // -- Participants
  const [participantLoading, setParticipantLoading] = useState(false);
  const [participantMessage, setParticipantMessage] = useState("");
  const [participantName, setParticipantName] = useState("");
  const handleAddParticipant = () => {
    setParticipantMessage("");
    setParticipantLoading(true);
    MeetingService.searchUser(participantName).then(
      () => {
        const tempUser = {
          user_id: participantList.length - 1,
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

  // -- Preset
  const [presetLoading, setPresetLoading] = useState();
  const [presetMessage, setPresetMessage] = useState("");
  const [preset, setPreset] = useState(new Array());
  const getPresets = () => {
    setPresetLoading(true);
    MeetingService.getPresets(participantName).then(
      (data) => {
        setPreset((oldPreset) => {
          console.log(data.preset);
          return data.preset;
        });
        setPresetLoading(false);
      },
      (error) => {
        console.log(error.response);
        const resMessage =
          (error.response && error.response.data && error.response.data.msg) ||
          error.message ||
          error.toString();

        setPresetLoading(false);
        setPresetMessage(resMessage);
      }
    );
  };
  const addPreset = () => {
    setWishlist((oldWishlist) => {
      console.log(oldWishlist);
      return [...oldWishlist, ...preset];
    });
  };

  // Run on mount
  useEffect(() => {
    getPresets();
  }, []);

  return (
    <Container>
      <h1>Create Meeting</h1>
      <Form>
        <Card>
          {/* Time schedule */}
          <Form.Group>
            <Form.Label>Time schedule</Form.Label>
            <DateTimePicker onChange={onDateTimeChange} value={dateTimeValue} />
          </Form.Group>
          {/* Select participants */}
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Select participants</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="username"
                  onChange={(e) => setParticipantName(e.target.value)}
                  value={participantName}
                />
                <Button
                  variant="primary"
                  onClick={handleAddParticipant}
                  disabled={participantLoading}
                >
                  +
                </Button>
                <div>
                  {participantMessage && (
                    <div className="alert alert-danger" role="alert">
                      {participantMessage}
                    </div>
                  )}
                </div>
              </Col>
              <Col>
                <Form.Label>Selected participants</Form.Label>
                <ol>
                  {participantList.map((participant) => {
                    if (currentUser.user_id == participant.user_id) {
                      return (
                        <li key={participant.user_id}>
                          <b>{participant.user_name}</b> (leader)
                        </li>
                      );
                    }

                    return (
                      <li key={participant.user_id}>
                        <Row>
                          <Col>{participant.user_name}</Col>
                          <Col>
                            <Button
                              className="delete-user-button"
                              variant="danger"
                              data-username={participant.user_name}
                              onClick={handleDeleteParticipant}
                            >
                              -
                            </Button>
                          </Col>
                        </Row>
                      </li>
                    );
                  })}
                </ol>
              </Col>
            </Row>
          </Form.Group>
          {/* Select preset */}
          <Form.Group>
            <Form.Label>Presets</Form.Label>
            {!presetLoading && (
              <Button variant="success" onClick={getPresets}>
                Refresh
              </Button>
            )}
            {!presetLoading && (
              <Button
                id="preset-confirm-btn"
                variant="info"
                onClick={addPreset}
              >
                Add to Wishlist
              </Button>
            )}
            {presetLoading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <div>
              {presetMessage && (
                <div className="alert alert-danger" role="alert">
                  {presetMessage}
                </div>
              )}
            </div>
            <Row id="preset-items">
              {preset.map((item, presetIndex) => {
                return (
                  <Col key={presetIndex}>
                    <Card>
                      <Carousel>
                        {item.image_URLs.map((imageUrl, imageIndex) => {
                          return (
                            <Carousel.Item key={imageIndex}>
                              <img
                                className="d-block"
                                src={imageUrl.imageUrl}
                                alt="First slide"
                              />
                            </Carousel.Item>
                          );
                        })}
                      </Carousel>
                      <label className="item-label">{item.item_name}</label>
                      <label className="item-price">
                        {"Price: " + item.price + "円"}
                      </label>
                      <label className="item-review">
                        {"Review: " +
                          (item.review != "0" ? item.review : "N/A")}
                      </label>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Form.Group>
          {/* Wishlist */}
          <label>{wishlist.length}</label>
        </Card>
      </Form>
    </Container>
  );
}
