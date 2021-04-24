import {
  SEND_MESSAGE,
  CREATE_CHATROOM,
  GET_CHATROOMS,
  GET_MESSAGES,
  SET_ACTIVE_CHATROOM,
  LOADING,
  CHAT_ERROR,
} from "./types";
import axios from "axios";

export const createChatroom = (creatorId, participantId) => (dispatch) => {};
export const getChatrooms = (isShop) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .get("/api/chat/getChatrooms", isShop ? shopConfig() : userConfig())
    .then((res) => res.data)
    .then((data) => {
      dispatch({ type: GET_CHATROOMS, payload: data });
    })
    .catch((err) => {
      dispatch({
        type: CHAT_ERROR,
        payload: {
          msg: err.response.data.errorMessage,
          status: err.response.status,
        },
      });
    });
};
export const setActiveChatroom = () => (dispatch) => {};
export const sendMessage = () => (dispatch) => {};
export const getMessages = () => (dispatch) => {};

const shopConfig = () => {
  const shopToken = localStorage.getItem("shop-token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (shopToken) config.headers["shop-token"] = shopToken;
  return config;
};

const userConfig = () => {
  const userToken = localStorage.getItem("user-token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (userToken) config.headers["user-token"] = userToken;
  return config;
};

/*

  send message about this product => tıklandığında
  Backend tarafında yeni bir chatroom oluştur 
  Frontend için aktif chat room'u oluşturulan oda olarak ayarla 

  Tıklayan kişinin ID'sini ve Satıcının ID'sini al

*/
