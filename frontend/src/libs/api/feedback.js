import BASE_URL from "./constant";
import axios from "axios";

export function sendFeedback(meetingID, feedback) {
  const url = `${BASE_URL}/meeting/feedback`;
  const data = {
    MeetingID: meetingID,
    Feedback: feedback,
  };

  axios
    .post(url, data)
    .then((res) => console.log("successed sendFeedback"))
    .catch((e) => console.error(e));
  //TODO Check: data format
  //TODO Error handling
}
