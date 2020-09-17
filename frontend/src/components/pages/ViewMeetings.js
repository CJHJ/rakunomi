import React from "react";
import { MeetingList } from "../organisms";
import { Container, Tabs, Tab, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AuthService from "../../services/auth.service";

import {
  fetchInvitedMeetings,
  fetchUpcomingMeetings,
  fetchParticipatedMeetings,
  fetchAllMeetings,
} from "../../libs/api/meetings";

const MENU_ITEMS = ["Invited", "Upcoming", "Past", "Others"];
const ACTION_NAMES = [
  "Check the Detail",
  "View Detail",
  "Give Feedback",
  "View Detail",
];

export default function ViewMeetings() {
  const history = useHistory();
  const [user, setUser] = React.useState();
  const [invitedMeetings, setInvitedMeetings] = React.useState();
  const [upcomingMeetings, setUpcomingMeetings] = React.useState();
  const [participatedMeetings, setParticipatedMeetings] = React.useState();
  const [allMeetings, setAllMeetings] = React.useState();

  React.useEffect(() => {
    loadAndSetUserID();
  }, []);

  const loadAndSetUserID = async () => {
    const userFromLocalStorage = AuthService.getCurrentUser();
    setUser(userFromLocalStorage);
  };

  React.useEffect(() => {
    if (user && user.user_id) {
      fetchMeetings(user.user_id);
    }
  }, [user]);

  const fetchMeetings = async (user_id) => {
    const fetchedInvitedMeetings = await fetchInvitedMeetings(user_id);
    setInvitedMeetings(fetchedInvitedMeetings);
    const fetchedUpcomingMeetings = await fetchUpcomingMeetings(user_id);
    setUpcomingMeetings(fetchedUpcomingMeetings);
    const fetchedParticipatedMeetings = await fetchParticipatedMeetings(
      user_id
    );
    setParticipatedMeetings(fetchedParticipatedMeetings);
    const fetchedAllMeetings = await fetchAllMeetings();
    setAllMeetings(fetchedAllMeetings);
  };

  const goToDetailPage = (event) => {
    const meeting_id = event.target.value;
    console.log("goToDetailPage");
    console.log({ meeting_id });
    history.push("/meeting/view");
  };

  const goToFeedBackPage = (event) => {
    const meeting_id = event.target.value;
    const targetMeeting = participatedMeetings.find(
      (meeting) => meeting.meeting_id === meeting_id
    );
    history.push("/meeting/feedback", { meeting: targetMeeting });
  };

  return (
    <Container>
      <h1>Meeting lists</h1>
      <Tabs>
        <Tab eventKey={MENU_ITEMS[0]} title={MENU_ITEMS[0]}>
          <MeetingList
            meetings={invitedMeetings}
            meetingAction={goToDetailPage}
            actionName={ACTION_NAMES[0]}
          />
        </Tab>
        <Tab eventKey={MENU_ITEMS[1]} title={MENU_ITEMS[1]}>
          <MeetingList
            meetings={upcomingMeetings}
            meetingAction={goToDetailPage}
            actionName={ACTION_NAMES[1]}
          />
        </Tab>
        <Tab eventKey={MENU_ITEMS[2]} title={MENU_ITEMS[2]}>
          <MeetingList
            meetings={participatedMeetings}
            meetingAction={goToFeedBackPage}
            actionName={ACTION_NAMES[2]}
          />
        </Tab>
        <Tab eventKey={MENU_ITEMS[3]} title={MENU_ITEMS[3]}>
          <MeetingList
            meetings={allMeetings}
            meetingAction={goToDetailPage}
            actionName={ACTION_NAMES[3]}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
