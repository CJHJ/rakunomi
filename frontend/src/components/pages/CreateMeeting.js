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
  Button,
} from "react-bootstrap";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";

import AuthService from "../../services/auth.service";
import MeetingService from "../../services/meeting.service";

import "./css/CreateMeeting.css";

export default function CreateMeeting() {
  const currentUser = AuthService.getCurrentUser();
  const [participantLoading, setParticipantLoading] = useState(false);
  const [participantMessage, setParticipantMessage] = useState("");

  const [dateTimeValue, onDateTimeChange] = useState(new Date());
  const [participantList, setParticipantList] = useState(
    new Array(currentUser)
  );

  // Handlers
  // -- Participants
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
        </Card>
      </Form>
    </Container>
  );
}
