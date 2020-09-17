import axios from "axios";
import authHeader from "./auth-header";
import {
  API_SEARCH_USER_URL,
  API_SEARCH_ITEM_URL,
  API_GET_PRESET_URL,
  API_RECOMMEND_ITEM_URL,
} from "../constants";

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

const getPresets = () => {
  return axios({
    method: "get",
    url: API_GET_PRESET_URL,
  }).then((response) => {
    return response.data;
  });
};

const searchItem = (keyword) => {
  return axios({
    method: "get",
    url: API_SEARCH_ITEM_URL,
    params: {
      keyword: keyword,
    },
    headers: authHeader(),
  }).then((response) => {
    return response.data;
  });
};

const recommendItem = (keyword) => {
  return axios({
    method: "get",
    url: API_RECOMMEND_ITEM_URL,
    params: {
      keyword: keyword,
    },
    headers: authHeader(),
  }).then((response) => {
    console.log(response);

    return response.data;
  });
};

export default {
  searchUser,
  getPresets,
  searchItem,
  recommendItem,
};
