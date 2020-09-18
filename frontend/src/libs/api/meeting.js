import axios from "axios";
import BASE_URL from "./constant";
import authHeader from "../../services/auth-header";

export const fetchMeeting = async (meeting_id) => {
  const url = `${BASE_URL}/meeting`;
  const res = await axios({
    method: "get",
    url: url,
    params: {
      meeting_id: meeting_id,
    },
    headers: authHeader(),
  });

  const data = res.data.data;
  return data;
};

export const fetchWishlist = async (meeting_id) => {
  const url = `${BASE_URL}/wishlist`;
  const res = await axios({
    method: "get",
    url: url,
    params: {
      meeting_id: meeting_id,
    },
    headers: authHeader(),
  });

  const data = res.data.data;
  return data;
};
export const fetchItemsInfoWithProductCodes = async (items) => {
  const url = `${BASE_URL}/search/product_id`;
  const res = items.map((item) => {
    return axios({
      method: "get",
      url: url,
      params: {
        product_id: item.product_id,
      },
    }).then((res) => {
      if (res.data.item.length == 0) {
        return {
          image_URLs: [""],
          price: item.total_price,
          item_name: item.product_id,
        };
      }
      return res.data.item;
    });
  });

  const resList = await Promise.all(res);
  return resList.map((res) => {
    return res;
  });
};
