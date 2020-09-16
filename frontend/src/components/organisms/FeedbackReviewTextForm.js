import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Pandas } from ".";

export default function FeedbackReviewTextForm(props) {
  const { handleInput, meeting, rating } = props;
  return (
    <Container fluid>
      <Row>
        <Col sm={6}>
          <h2>
            {`How was the foods and drinks you ordered in "${meeting.groupName}"`}
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
