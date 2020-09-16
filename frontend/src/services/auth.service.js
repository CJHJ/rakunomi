import axios from "axios";
import { API_SIGNUP_URL, API_SIGNIN_URL } from "../constants";

const signup = (username, email, password, rakutenId, zoomId) => {
  var signupFormData = new FormData();

  signupFormData.append("username", username);
  signupFormData.append("password", password);
  signupFormData.append("email", email);
  signupFormData.append("zoom_id", zoomId);
  signupFormData.append("rakuten_id", rakutenId);

  return axios({
    method: "post",
    url: API_SIGNUP_URL,
    data: signupFormData,
    headers: { "Content-Type": "multipart/form-data" },
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
    if (response.data) {
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
