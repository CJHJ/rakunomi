import BASE_URL from "./constant";
import axios from "axios";
import authHeader from "../../services/auth-header";

export async function sendFeedback(meetingID, feedback) {
  const url = `${BASE_URL}/feedback`;
  const fromData = new FormData();
  fromData.append("meeting_id", meetingID);
  fromData.append("review", feedback);
  const headers = authHeader();
  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: fromData,
      headers: headers,
    });
  } catch (e) {
    console.log(e);
  }
}
