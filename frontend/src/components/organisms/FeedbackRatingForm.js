import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";

export default function FeedbackRatingForm(props) {
  const { handleInput } = props;
  return (
    <Container fluid>
      <Row>
        <Col sm={6}>
          <h2>{"How was the Raku Nomi"}</h2>
        </Col>
        <Col sm={6}>
          <Form>
            <Form.Control type="range" onChange={handleInput} />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
