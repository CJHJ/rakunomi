import React from "react";
import { Container, Card, Spinner, Row } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";

import {
  fetchMeeting,
  fetchWishlist,
  fetchItemsInfoWithProductCodes,
} from "../../libs/api/meeting";
import { ItemCard } from "../organisms";
import { getFeedbacks } from "../../libs/api/feedback";

export default function CreateMeeting() {
  const location = useLocation();
  const history = useHistory();
  const [meetingInfo, setMeetingInfo] = React.useState();
  const [meeting, setMeeting] = React.useState();
  const [wishlist, setWishList] = React.useState();
  const [items, setItems] = React.useState();
  const [totalPrice, setTotalPrice] = React.useState();
  const [visible, setVisible] = React.useState(true);
  const [reviews, setReviews] = React.useState([
    { feedback_msg: "aaaaa" },
    { feedback_msg: "bbb" },
  ]);

  React.useEffect(() => {
    initState();
  }, []);
  React.useEffect(() => {
    if (!wishlist) {
      return;
    }
    let prise = 0;
    wishlist.forEach((item) => {
      prise = prise + item.total_price;
    });
    setTotalPrice(prise);
  }, [wishlist]);
  if (!location.state) {
    return <div>不正な画面遷移</div>;
  }
  const initState = async () => {
    const { meeting, hide } = location.state;
    setVisible(!hide);
    setMeeting(meeting);
    const fetchedMeetingInfo = await fetchMeeting(meeting.meeting_id);
    const fetchedReviews = await getFeedbacks(meeting.meeting_id);
    setReviews(fetchedReviews);
    console.log({ fetchedReviews });
    const fetchedWishlist = await fetchWishlist(meeting.meeting_id);
    const fetchedItems = await fetchItemsInfoWithProductCodes(fetchedWishlist);
    setMeetingInfo(fetchedMeetingInfo);
    setWishList(fetchedWishlist);
    setItems(fetchedItems);
  };

  if (!items) {
    return (
      <Container>
        <h1>Loading ... </h1>
        <Spinner animation="border" />
      </Container>
    );
  }
  const userList = (users) => {
    let res = "";
    users.forEach((user) => {
      res += `${user} `;
    });
    return res;
  };

  const reviewList = () => {
    const allReviews = reviews.map((review) => (
      <Card>{review.feedback_msg}</Card>
    ));
    return allReviews;
  };

  return (
    <Container className="main-meeting-container">
      <h1>Meeting Detail</h1>
      <Card>
        <div>Nomikai Name:{meetingInfo.meeting_name || "No Nomikai name"}</div>
        {visible && (
          <div>
            <div>From: {meeting.datetime}</div>
            <div>Inviter: {meetingInfo.leader_username}</div>
            <div>Invited members: {userList(meetingInfo.invited_username)}</div>
            <div>
              Joined members: {userList(meetingInfo.confirmed_username)}
            </div>
            <div>
              Price for one person:
              {totalPrice / meetingInfo.invited_username.length} yen
            </div>
          </div>
        )}
        <div>Total Price: {totalPrice} yen</div>
      </Card>
      <Container>
        <Row>
          {items.map((item) => (
            <ItemCard item={item} />
          ))}
        </Row>
        <Row>
          {!visible && (
            <div>
              <h4>Reviews by attendees</h4>
              <p>{reviewList()}</p>
            </div>
          )}
        </Row>
      </Container>
    </Container>
  );
}
