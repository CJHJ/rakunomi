import BASE_URL from "./constant";
import axios from "axios";
import authHeader from "../../services/auth-header";

export async function sendFeedback(meetingID, feedback) {
  const url = `${BASE_URL}/feedback`;
  const data = {
    meeting_id: meetingID,
    Feedback: feedback,
  };
  const headers = authHeader();
  try {
    const res = await axios({
      method: "get",
      url: url,
      params: data,
      headers: headers,
    });
  } catch (e) {
    console.log(e);
  }
}
