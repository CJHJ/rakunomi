import axios from "axios";
import BASE_URL from "./constant";
import authHeader from "../../services/auth-header";
const MEETING_TEMPLATE = {
  meeting_id: "meeting ID",
  meeting_name: "Group Name",
  leader_user_id: "leader_user_id",
  Datetime: "YYYY-MM-DD hh:mm",
};
const FAKE_INVITED = [
  {
    meeting_id: "meeting ID1",
    meeting_name: "Uchiage for the tech training",
    leader_user_id: "Nathaniel Fujita",
    Datetime: "2020-09-18 18:00",
  },
  {
    meeting_id: "meeting ID2",
    meeting_name: "Christmas party",
    leader_user_id: "Taro Tanaka",
    Datetime: "2020-12-25 10:00",
  },
  {
    meeting_id: "meeting ID3",
    meeting_name: "Year End Party",
    leader_user_id: "Hanako Yamada",
    Datetime: "2020-12-25 10:00",
  },
];

export async function fetchInvitedMeetings(userID) {
  const url = `${BASE_URL}/meetings/invited`;
  console.log("invited", url);
  const res = await requestWithAuth(url);
  return FAKE_INVITED;
}
export async function fetchUpcomingMeetings(userID) {
  const url = `${BASE_URL}/meetings`;
  console.log("up", url);
  // const res = await requestWithAuth(url);
  return [{ ...MEETING_TEMPLATE, meeting_name: "Upcoming" }];
}
export async function fetchParticipatedMeetings(userID) {
  const url = `${BASE_URL}/meetings/past`;
  console.log("past me", url);
  // const res = await requestWithAuth(url);
  return [{ ...MEETING_TEMPLATE, meeting_name: "Participated" }];
}
export async function fetchAllMeetings() {
  const url = `${BASE_URL}/meetings/past`;
  console.log("all", url);
  // const res = await requestWithAuth(url);
  return [{ ...MEETING_TEMPLATE, meeting_name: "ALL" }];
}

const requestWithAuth = async (url) => {
  const user_id = 1; //TODO get real USERID
  const headers = authHeader();
  console.log({ headers });

  const res = await axios({
    method: "get",
    url: url,
    params: {
      user_id: user_id,
    },
    headers: authHeader(),
  });
  console.log(res.data);
  return res.data;
};
