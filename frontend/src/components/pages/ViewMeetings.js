import React from "react";
import { MeetingList } from "../organisms";
import { Container, Tabs, Tab, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import {
  fetchInvitedMeetings,
  fetchUpcomingMeetings,
  fetchParticipatedMeetings,
  fetchAllMeetings,
} from "../../libs/api/meetings";

const MENU_ITEMS = ["Invited", "Upcoming", "Past", "Others"];
const ACTION_NAMES = ["Join", "View Detail", "Give Feedback", "View Detail"];

export default function ViewMeetings() {
  const history = useHistory();
  const [userID, setUserID] = React.useState();
  const [invitedMeetings, setInvitedMeetings] = React.useState();
  const [upcomingMeetings, setUpcomingMeetings] = React.useState();
  const [participatedMeetings, setParticipatedMeetings] = React.useState();
  const [allMeetings, setAllMeetings] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedMeetingID, setSelectedMeetingID] = React.useState();

  React.useEffect(() => {
    initStates();
  }, []);

  const initStates = async () => {
    const userIDFromLocalStorage = await loadAndSetUserID();
    fetchMeetings(userIDFromLocalStorage);
  };

  const loadAndSetUserID = async () => {
    const userIDFromLocalStorage = 0; //TODO change it to get real user ID
    setUserID(userIDFromLocalStorage);
    return userIDFromLocalStorage;
  };

  const fetchMeetings = async (userID) => {
    const fetchedInvitedMeetings = await fetchInvitedMeetings(userID);
    setInvitedMeetings(fetchedInvitedMeetings);
    const fetchedUpcomingMeetings = await fetchUpcomingMeetings(userID);
    setUpcomingMeetings(fetchedUpcomingMeetings);
    const fetchedParticipatedMeetings = await fetchParticipatedMeetings(userID);
    setParticipatedMeetings(fetchedParticipatedMeetings);
    const fetchedAllMeetings = await fetchAllMeetings();
    setAllMeetings(fetchedAllMeetings);
    console.log("Loaded");
  };

  const openModal = (event) => {
    setModalVisible(true);
    setSelectedMeetingID(event.target.value);
  };
  const hideModal = () => {
    setModalVisible(false);
    setSelectedMeetingID();
  };

  const acceptInvitation = () => {
    setModalVisible(false);
    console.log("accepted");
    console.log(selectedMeetingID);
    initStates();
  };
  const goToDetailPage = () => {
    console.log("goToDetailPage");
  };
  const goToFeedBackPage = (event) => {
    const meetingID = event.target.value;
    const targetMeeting = participatedMeetings.find(
      (meeting) => meeting.meetingID === meetingID
    );
    history.push("/meeting/feedback", { meeting: targetMeeting });
  };

  return (
    <Container>
      <Modal show={modalVisible} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Will you join this nomikai?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={hideModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={acceptInvitation}>
            Join
          </Button>
        </Modal.Footer>
      </Modal>
      <h1>Meeting lists</h1>
      <Tabs>
        <Tab eventKey={MENU_ITEMS[0]} title={MENU_ITEMS[0]}>
          <MeetingList
            meetings={invitedMeetings}
            meetingAction={openModal}
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
            meetingAction={goToFeedBackPage}
            actionName={ACTION_NAMES[3]}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
