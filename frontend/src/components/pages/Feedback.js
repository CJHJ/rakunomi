import React from "react";
import { Container, Button, Row, Col, Modal } from "react-bootstrap";
import { Divider } from "@material-ui/core";
import { FeedbackReviewTextForm, FeedbackRatingForm } from "../organisms";
import { useLocation, useHistory } from "react-router-dom";
import { sendFeedback } from "../../lib/api/feedback";

const MESSAGE = `Our goal is to continue offering top-notch products at good prices, and your review could greatly help us to continue doing so.
I really appreciate you taking out the time to help us improve our offerings!`;
export default function () {
  const location = useLocation();
  const history = useHistory();
  if (!location.state) {
    return <div>不正な画面遷移</div>;
  }
  const { meeting } = location.state;
  const [review, setReview] = React.useState("");
  const [rating, setRating] = React.useState(80);
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleTextInput = (event) => {
    setReview(event.target.value);
  };
  const handleRatingInput = (event) => {
    console.log(event.target.value);
    setRating(event.target.value);
  };
  const submitFeedback = () => {
    setModalVisible(true);
    sendFeedback(meeting.meetingID, review);
  };
  const goBackToMeetingList = () => {
    history.goBack();
  };
  return (
    <Container fluid>
      <Modal show={modalVisible}>
        <Modal.Header>
          <Modal.Title>
            Thank you for using Raku Nomi and sending your feedback!
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={goBackToMeetingList}>
            Go Back To Meeting List
          </Button>
        </Modal.Footer>
      </Modal>
      <h5>{MESSAGE}</h5>
      <FeedbackRatingForm handleInput={handleRatingInput} meeting={meeting} />
      <Divider />
      <FeedbackReviewTextForm
        handleInput={handleTextInput}
        meeting={meeting}
        rating={rating}
      />
      <Row>
        <Col></Col>
        <Col>
          <Button onClick={submitFeedback} disabled={review.length <= 4}>
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
