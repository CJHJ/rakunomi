import axios from "axios";
import authHeader from "./auth-header";
import { API_SEARCH_USER_URL } from "../constants";

const searchUser = (username) => {
  return axios({
    method: "get",
    url: API_SEARCH_USER_URL,
    params: {
      username: username,
    },
    headers: authHeader(),
  }).then((response) => {
    console.log(response);

    return response.data;
  });
};

export default {
  searchUser,
};
