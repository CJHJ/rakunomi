import React from "react";
import { Card, Button, Spinner } from "react-bootstrap";

export default function MeetingList(props) {
  if (!props.meetings) {
    return <Spinner animation="border" />;
  }
  const renderRow = (meeting) => {
    return (
      <div style={{ margin: 10 }} key={meeting.meeting_id}>
        <Card key={meeting.meeting_id} className="text-center">
          <Card.Body>
            <Card.Title>{meeting.meeting_name}</Card.Title>
            <Card.Text>
              Invited by:{"<meeting.leader_name>"}
              {meeting.leaderName}
            </Card.Text>
            <Card.Text>Datetime: {meeting.Datetime}</Card.Text>
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
