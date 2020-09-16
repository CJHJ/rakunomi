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
  var loginFormData = new FormData();

  loginFormData.append("username", username);
  loginFormData.append("password", password);

  return axios({
    method: "post",
    url: API_SIGNIN_URL,
    data: loginFormData,
    headers: { "Content-Type": "multipart/form-data" },
  }).then((response) => {
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data.token));
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
