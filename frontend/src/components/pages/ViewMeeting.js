import React from "react";
import { Container, Card, Spinner, Row } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";

import {
  fetchMeeting,
  fetchWishlist,
  fetchItemsInfoWithProductCodes,
} from "../../libs/api/meeting";
import { ItemCard } from "../organisms";

export default function CreateMeeting() {
  const location = useLocation();
  const history = useHistory();
  const [meetingInfo, setMeetingInfo] = React.useState();
  const [meeting, setMeeting] = React.useState();
  const [wishlist, setWishList] = React.useState();
  const [items, setItems] = React.useState();
  const [totalPrice, setTotalPrice] = React.useState();

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
    const { meeting } = location.state;
    setMeeting(meeting);
    const fetchedMeetingInfo = await fetchMeeting(meeting.meeting_id);
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

  return (
    <Container className="main-meeting-container">
      <h1>Meeting Detail</h1>
      <Card>
        <div>{meetingInfo.meeting_name || "No meeting name"}</div>
        <div>From: {meeting.datetime}</div>
        <div>Inviter: {meetingInfo.leader_username}</div>
        <div>Invited members: {userList(meetingInfo.invited_username)}</div>
        <div>Joined members: {userList(meetingInfo.confirmed_username)}</div>
        <div>Total Price: {totalPrice} yen</div>
        <div>
          Price for one person:{" "}
          {totalPrice / meetingInfo.invited_username.length} yen
        </div>
      </Card>
      <Container>
        <Row>
          {items.map((item) => (
            <ItemCard item={item} />
          ))}
        </Row>
      </Container>
    </Container>
  );
}
