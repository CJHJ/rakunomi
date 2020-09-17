import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Pandas } from ".";

export default function FeedbackReviewTextForm(props) {
  const { handleInput, meeting, rating } = props;
  console.log({ meeting });
  const meeting_name_to_display = meeting.meeting_name
    ? `in "${meeting.meeting_name}"`
    : "in the Nomikai";
  return (
    <Container fluid>
      <Row>
        <Col sm={6}>
          <h2>
            {`How was the foods and drinks you ordered ${meeting_name_to_display} ?`}
          </h2>
          <Pandas rating={rating} />
        </Col>
        <Col sm={6}>
          <Form>
            <Form.Control as="textarea" rows={12} onChange={handleInput} />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
