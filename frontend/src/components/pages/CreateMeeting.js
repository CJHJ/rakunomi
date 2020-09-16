import React, { Component, useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Tabs,
  Tab,
  Modal,
  Button,
} from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";

import AuthService from "../../services/auth.service";

import "./css/CreateMeeting.css";

export default function CreateMeeting() {
  const currentUser = AuthService.getCurrentUser();

  const [dateTimeValue, onDateTimeChange] = useState(new Date());
  const [participantList, onMemberListChange] = useState(
    new Array(currentUser)
  );

  // Handlers
  const [participantName, setParticipantName] = useState("");
  const handleAddParticipant = () => {
    console.log(participantName);
  };

  return (
    <Container>
      <h1>Create Meeting</h1>
      <Form>
        <Card>
          <h2>General info</h2>
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
                <Button variant="primary" onClick={handleAddParticipant}>
                  +
                </Button>
              </Col>
              <Col>
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
                      <li key={participant.user_id}>{participant.user_name}</li>
                    );
                  })}
                </ol>
              </Col>
            </Row>
          </Form.Group>
        </Card>
      </Form>
    </Container>
  );
}
