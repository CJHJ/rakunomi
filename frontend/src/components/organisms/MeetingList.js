import React from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function MeetingList(props) {
  const history = useHistory();
  if (!props.meetings) {
    return <Spinner animation="border" />;
  }

  if (props.meetings.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Nothing to show</Card.Title>
          <Button
            variant="primary"
            onClick={() => {
              history.push("/meeting/create");
            }}
            size="lg"
            block
          >
            {"Create New Nomikai"}
          </Button>
        </Card.Body>
      </Card>
    );
  }
  const renderRow = (meeting) => {
    return (
      <div style={{ margin: 10 }} key={meeting.meeting_id}>
        <Card key={meeting.meeting_id} className="text-center">
          <Card.Body>
            <Card.Title>{meeting.meeting_name}</Card.Title>
            {meeting.leader_username && (
              <Card.Text>Invited by:{meeting.leader_username}</Card.Text>
            )}
            {meeting.datetime && (
              <Card.Text>datetime: {meeting.datetime}</Card.Text>
            )}
            <Button
              variant="primary"
              value={meeting.meeting_id}
              onClick={props.meetingAction}
              size="lg"
              block
            >
              {props.actionName}
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  };
  return <div>{props.meetings.map((meeting) => renderRow(meeting))}</div>;
}
