import axios from "axios";
import BASE_URL from "./constant";
import authHeader from "../../services/auth-header";
import moment from "moment";

export async function fetchInvitedMeetings(user_id) {
  const url = `${BASE_URL}/meetings/invited`;
  const data = await requestWithAuth(url, user_id);
  return data;
}
export async function fetchUpcomingMeetings(user_id) {
  const url = `${BASE_URL}/meetings`;
  const data = await requestWithAuth(url, user_id);
  return data;
}
export async function fetchParticipatedMeetings(user_id) {
  const url = `${BASE_URL}/meetings/past`;
  const data = await requestWithAuth(url, user_id);
  return data;
}
export async function fetchAllMeetings(user_id) {
  const url = `${BASE_URL}/meetings/all_past`;
  const data = await requestWithAuth(url, user_id);
  return data;
}

const requestWithAuth = async (url, user_id) => {
  const res = await axios({
    method: "get",
    url: url,
    params: {
      user_id: user_id,
    },
    headers: authHeader(),
  });
  const data = res.data.data;
  return data.map((meeting) => {
    if (!meeting.datetime) {
      return meeting;
    }
    return {
      ...meeting,
      datetime: moment.utc(meeting.datetime).format("YYYY/MM/DD HH:mm"),
    };
  });
};
