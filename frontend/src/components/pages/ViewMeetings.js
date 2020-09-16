import React from "react";
import { ItemSelector } from "../organisms";
import { Card, Button } from "react-bootstrap";

const MENU_ITEMS = ["招待された", "参加予定", "参加済み", "全ての履歴"];

const ACTION_NAMES = ["Join", "View Detail", "View Detail", "Give Feedback"];
const MEETING_TEMPLATE = {
  meetingID: "meeting ID",
  groupName: "groupName",
  leaderName: "leaderName",
  dateTime: "20200918000000",
};

const MeetingList = (props) => {
  const renderRow = (meeting) => {
    return (
      <Card key={meeting.meetingID}>
        <Card.Body>
          <Card.Title>{meeting.groupName}</Card.Title>
          <Card.Text>Invited: {meeting.leaderName}</Card.Text>
          <Card.Text>Datetime: {meeting.dateTime}</Card.Text>
          <Button
            variant="primary"
            value={meeting.meetingID}
            onClick={props.meetingAction}
          >
            {props.actionName}
          </Button>
        </Card.Body>
      </Card>
    );
  };
  return <div>{props.meetings.map((meeting) => renderRow(meeting))}</div>;
};

export default function ViewMeetings() {
  const [selectedMenu, setSelectedMenu] = React.useState(MENU_ITEMS[0]);

  const [invitedMeetings, setInvitedMeetings] = React.useState([
    { ...MEETING_TEMPLATE, groupName: "Invited" },
  ]);
  const [upcomingMeetings, setUpcomingMeetings] = React.useState([
    { ...MEETING_TEMPLATE, groupName: "Upcoming" },
  ]);
  const [participatedMeetings, setParticipatedMeetings] = React.useState([
    { ...MEETING_TEMPLATE, groupName: "Participated" },
  ]);

  const [allMeetings, setAllMeetings] = React.useState([
    { ...MEETING_TEMPLATE, groupName: "All" },
  ]);

  const [meetingsToDisplay, setMeetingsToDisplay] = React.useState([]);
  const [meetingAction, setMeetingAction] = React.useState();
  const [actionName, setActionName] = React.useState(ACTION_NAMES[0]);

  const handleChange = (eventKey) => {
    setSelectedMenu(eventKey);
  };

  React.useEffect(() => {
    switch (selectedMenu) {
      case MENU_ITEMS[0]:
        setMeetingsToDisplay(invitedMeetings);
        setMeetingAction((event) => acceptInvitation);
        setActionName(ACTION_NAMES[0]);
        break;
      case MENU_ITEMS[1]:
        setMeetingsToDisplay(upcomingMeetings);
        setMeetingAction((event) => goToDetailPage);
        setActionName(ACTION_NAMES[1]);
        break;
      case MENU_ITEMS[2]:
        setMeetingsToDisplay(participatedMeetings);
        setMeetingAction((event) => goToFeedBackPage);
        setActionName(ACTION_NAMES[2]);
        break;
      case MENU_ITEMS[3]:
        setMeetingsToDisplay(allMeetings);
        setMeetingAction((event) => goToDetailPage);
        setActionName(ACTION_NAMES[3]);
        break;
    }
  }, [selectedMenu]);

  const acceptInvitation = (event) => {
    console.log("accepted");
    console.log(event.target.value);
  };
  const goToDetailPage = () => {
    console.log("goToDetailPage");
  };
  const goToFeedBackPage = () => {
    console.log("goToFeedBackPage");
  };

  return (
    <div>
      <h1>Meeting lists</h1>
      <ItemSelector
        handleChange={handleChange}
        value={selectedMenu}
        itemList={MENU_ITEMS}
      />
      <MeetingList
        meetings={meetingsToDisplay}
        meetingAction={meetingAction}
        actionName={actionName}
      />
    </div>
  );
}
