import BASE_URL from "./constant";
const MEETING_TEMPLATE = {
  meetingID: "meeting ID",
  groupName: "Group Name",
  leaderName: "leaderName",
  dateTime: "YYYY-MM-DD hh:mm",
};

const INVITED_MEETIND_TEMPLATE = { ...MEETING_TEMPLATE, groupname: "invited" };

export async function fetchInvitedMeetings(userID) {
  // const url = `${BASE_URL}/meetings/invited/${userID}`;
  // const res = await fetch(url, { method: "GET" });
  // return res.date;
  return [
    {
      meetingID: "meeting ID1",
      groupName: "Uchiage for the tech training",
      leaderName: "Nathaniel Fujita",
      dateTime: "2020-09-18 18:00",
    },
    {
      meetingID: "meeting ID2",
      groupName: "Christmas party",
      leaderName: "Taro Tanaka",
      dateTime: "2020-12-25 10:00",
    },
    {
      meetingID: "meeting ID3",
      groupName: "Year End Party",
      leaderName: "Hanako Yamada",
      dateTime: "2020-12-25 10:00",
    },
    INVITED_MEETIND_TEMPLATE,
  ];
}
export async function fetchUpcomingMeetings(userID) {
  // const url = `${BASE_URL}/meetings/${userID}`;
  // const res = await fetch(url, { method: "GET" });
  // return res.date;
  return [{ ...MEETING_TEMPLATE, groupName: "Upcoming" }];
}
export async function fetchParticipatedMeetings(userID) {
  // const url = `${BASE_URL}/meetings/past/${userID}`;
  // const res = await fetch(url, { method: "GET" });
  // return res.date;
  return [{ ...MEETING_TEMPLATE, groupName: "Participated" }];
}
export async function fetchAllMeetings() {
  // const url = `${BASE_URL}/meetings/past`;
  // const res = await fetch(url, { method: "GET" });
  // return res.date;
  return [{ ...MEETING_TEMPLATE, groupName: "ALL" }];
}
