import axios from "axios";
import { API_SIGNUP_URL, API_SIGNIN_URL } from "../constants";

const signup = (username, email, password, rakutenId, zoomId) => {
  return axios.post(API_SIGNUP_URL, {
    username,
    email,
    password,
    rakutenId,
    zoomId,
  });
};

const login = (username, password) => {
  return axios
    .post(API_SIGNIN_URL, {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
};
