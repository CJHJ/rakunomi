import React from "react";
import { MeetingList } from "../organisms";
import { Container, Tabs, Tab } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AuthService from "../../services/auth.service";

import {
  fetchInvitedMeetings,
  fetchUpcomingMeetings,
  fetchParticipatedMeetings,
  fetchAllMeetings,
} from "../../libs/api/meetings";
import { Beer, ClinkingBeer, Invited, Participated, All } from "../atoms/Icons";

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

  const goToDetailPageUpcoming = (event) => {
    const meeting_id = parseInt(event.target.value, 10);
    const targetMeeting = upcomingMeetings.find(
      (meeting) => meeting.meeting_id === meeting_id
    );
    if (targetMeeting.leader_username === user.user_name) {
      history.push("/meeting/edit", { meeting: targetMeeting });
    } else {
      history.push("/meeting/view", { meeting: targetMeeting });
    }
  };
  const goToDetailPageAll = (event) => {
    const meeting_id = parseInt(event.target.value, 10);
    const targetMeeting = allMeetings.find(
      (meeting) => meeting.meeting_id === meeting_id
    );
    history.push("/meeting/view", { meeting: targetMeeting });
  };

  const goToEditPage = (event) => {
    const meeting_id = parseInt(event.target.value, 10);
    const targetMeeting = invitedMeetings.find(
      (meeting) => meeting.meeting_id === meeting_id
    );
    history.push("/meeting/edit", { meeting: targetMeeting });
  };

  const goToFeedBackPage = (event) => {
    const meeting_id = parseInt(event.target.value, 10);
    const targetMeeting = participatedMeetings.find(
      (meeting) => meeting.meeting_id === meeting_id
    );
    history.push("/meeting/feedback", { meeting: targetMeeting });
  };

  return (
    <Container>
      <h1 className="text-center">
        <Beer />
        Nomikai lists
        <Beer />
      </h1>
      <Tabs>
        <Tab
          eventKey={MENU_ITEMS[0]}
          title={
            <div className="text-center">
              <Invited />
              <br />
              {MENU_ITEMS[0]}
            </div>
          }
        >
          <MeetingList
            meetings={invitedMeetings}
            meetingAction={goToEditPage}
            actionName={ACTION_NAMES[0]}
          />
        </Tab>
        <Tab
          eventKey={MENU_ITEMS[1]}
          title={
            <div className="text-center">
              <ClinkingBeer />
              <br />
              {MENU_ITEMS[1]}
            </div>
          }
        >
          <MeetingList
            meetings={upcomingMeetings}
            meetingAction={goToDetailPageUpcoming}
            actionName={ACTION_NAMES[1]}
          />
        </Tab>
        <Tab
          eventKey={MENU_ITEMS[2]}
          title={
            <div className="text-center">
              <Participated />
              <br />
              {MENU_ITEMS[2]}
            </div>
          }
        >
          <MeetingList
            meetings={participatedMeetings}
            meetingAction={goToFeedBackPage}
            actionName={ACTION_NAMES[2]}
          />
        </Tab>
        <Tab
          eventKey={MENU_ITEMS[3]}
          title={
            <div className="text-center">
              <All />
              <br />
              {MENU_ITEMS[3]}
            </div>
          }
        >
          <MeetingList
            meetings={allMeetings}
            meetingAction={goToDetailPageAll}
            actionName={ACTION_NAMES[3]}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
