import React from "react";
import { Card, Button, Spinner } from "react-bootstrap";

export default function MeetingList(props) {
  if (!props.meetings) {
    return <Spinner animation="border" />;
  }
  const renderRow = (meeting) => {
    return (
      <div style={{ margin: 10 }} key={meeting.meetingID}>
        <Card key={meeting.meetingID} className="text-center">
          <Card.Body>
            <Card.Title>{meeting.groupName}</Card.Title>
            <Card.Text>Invited by: {meeting.leaderName}</Card.Text>
            <Card.Text>Datetime: {meeting.dateTime}</Card.Text>
            <Button
              variant="primary"
              value={meeting.meetingID}
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
