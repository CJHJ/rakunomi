import axios from "axios";
import authHeader from "./auth-header";
import {
  API_SEARCH_USER_URL,
  API_SEARCH_ITEM_URL,
  API_GET_PRESET_URL,
  API_RECOMMEND_ITEM_URL,
  API_CREATE_MEETING_URL,
  API_CREATE_WISHLIST_URL,
  API_SEARCH_PRODUCT_ID,
  API_UPDATE_WISHLIST_URL,
  API_CONFIRM_MEETING_URL,
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

const addWishlistToDatabase = (meetingId, wishlist) => {
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
      { meeting_id: meetingId, data: wishlistFormatted },
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

const getMeetingInfo = (meetingId) => {
  return axios({
    method: "get",
    url: API_CREATE_MEETING_URL,
    params: {
      meeting_id: meetingId,
    },
    headers: authHeader(),
  }).then((response) => {
    return response.data;
  });
};

const getWishlist = (meetingId) => {
  return axios({
    method: "get",
    url: API_CREATE_WISHLIST_URL,
    params: {
      meeting_id: meetingId,
    },
    headers: authHeader(),
  }).then((response) => {
    return response.data;
  });
};

const getProductInfo = (productId) => {
  return axios({
    method: "get",
    url: API_SEARCH_PRODUCT_ID,
    params: {
      product_id: productId,
    },
    headers: authHeader(),
  });
};

const updateWishlist = (meetingId, wishlist) => {
  const wishlistFormatted = wishlist.map((wish) => {
    return {
      product_id: wish.rakuten_pruduct_id,
      amount: 1,
      total_price: wish.price,
    };
  });

  const data = {
    meeting_id: meetingId,
    items: wishlistFormatted,
  };

  console.log(data);

  return axios({
    method: "PUT",
    url: API_UPDATE_WISHLIST_URL,
    data: data,
    headers: { "Content-Type": "application/json", ...authHeader() },
  }).then((response) => {
    return response.data;
  });
};

const updateMeeting = (meetingId, meetingName, datetime) => {
  console.log(meetingName);
  return axios({
    method: "put",
    url: API_CREATE_MEETING_URL,
    data: {
      meeting_id: meetingId,
      data: {
        meeting_name: meetingName,
        datetime: datetime,
      },
    },
    headers: { "Content-Type": "application/json", ...authHeader() },
  }).then((response) => {
    return response.data;
  });
};

const confirmMeeting = (meetingId) => {
  return axios({
    method: "get",
    url: API_CONFIRM_MEETING_URL,
    params: {
      meeting_id: meetingId,
    },
    headers: authHeader(),
  }).then((response) => {
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
  getMeetingInfo,
  getWishlist,
  getProductInfo,
  updateWishlist,
  confirmMeeting,
  updateMeeting,
};
