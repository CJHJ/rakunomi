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
  Spinner,
} from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";

import "./css/CreateMeeting.css";
import {
  fetchMeeting,
  fetchWishlist,
  fetchItemsInfoWithProductCodes,
} from "../../libs/api/meeting";

export default function CreateMeeting() {
  const location = useLocation();
  const history = useHistory();
  const [meetingInfo, setMeetingInfo] = React.useState();
  const [meeting, setMeeting] = React.useState();
  const [wishlist, setWishList] = React.useState();
  const [items, setItems] = React.useState();

  React.useEffect(() => {
    initState();
  }, []);
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
    console.log(fetchedMeetingInfo);
    console.log(fetchedItems);
  };

  if (!items) {
    return (
      <Container>
        <h1>Loading ... </h1>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="main-meeting-container">
      <h1>Meeting Detail</h1>
      <Card>
        <div>{meetingInfo.meeting_name || "No meeting name"}</div>
        <div>{meeting.datetime}</div>
        <div>{meetingInfo.invited_username[0]}</div>
        <div>{meetingInfo.confirmed_username[0]}</div>
        <div>{meetingInfo.leader_username}</div>
        <div>{items[0].item_name}</div>
      </Card>
    </Container>
  );
}
