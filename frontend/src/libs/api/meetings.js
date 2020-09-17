import axios from "axios";
import BASE_URL from "./constant";
import authHeader from "../../services/auth-header";

export async function fetchInvitedMeetings(user_id) {
  const url = `${BASE_URL}/meetings/invited`;
  const res = await requestWithAuth(url, user_id);
  return res.data;
}
export async function fetchUpcomingMeetings(user_id) {
  const url = `${BASE_URL}/meetings`;
  const res = await requestWithAuth(url, user_id);
  return res.data;
}
export async function fetchParticipatedMeetings(user_id) {
  const url = `${BASE_URL}/meetings/past`;
  const res = await requestWithAuth(url, user_id);
  return res.data;
}
export async function fetchAllMeetings(user_id) {
  const url = `${BASE_URL}/meetings/all_past`;
  const res = await requestWithAuth(url, user_id);
  return res.data;
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
  return res.data;
};
