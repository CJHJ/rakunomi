import axios from "axios";
import authHeader from "./auth-header";
import {
  API_SEARCH_USER_URL,
  API_SEARCH_ITEM_URL,
  API_GET_PRESET_URL,
  API_RECOMMEND_ITEM_URL,
  API_CREATE_MEETING_URL,
  API_CREATE_WISHLIST_URL,
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

const createMeeting = (meetingName, datetime, participantsId) => {
  var meetingData = {
    meeting_name: meetingName,
    datetime: datetime,
    invited_users_id: participantsId,
  };

  return axios
    .post(API_CREATE_MEETING_URL, meetingData, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    })
    .then((response) => {
      return response.data;
    });
};

const addWishlistToDatabase = (meeting_id, wishlist) => {
  const wishlistFormatted = wishlist.map((wish) => {
    return {
      product_id: wish.rakuten_pruduct_id,
      amount: 1,
      total_price: wish.price,
    };
  });

  return axios
    .post(
      API_CREATE_WISHLIST_URL,
      { meeting_id, data: wishlistFormatted },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

export default {
  searchUser,
  getPresets,
  searchItem,
  recommendItem,
  createMeeting,
  addWishlistToDatabase,
};
