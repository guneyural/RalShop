import {
  RECEIVE_MESSAGE,
  CREATE_CHATROOM,
  GET_CHATROOMS,
  SET_ACTIVE_CHATROOM,
  FORBIDDEN_ROOM,
  LOADING,
  CHAT_ERROR,
} from "./types";
import axios from "axios";

export const createChatroom = (participantId, isShop) => (dispatch) => {
  dispatch({ type: LOADING });

  axios
    .post(
      "/api/chat/createRoom",
      { participantId },
      isShop ? shopConfig() : userConfig()
    )
    .then((res) => res.data)
    .then((data) => {
      let chatroomObject = { chatroom: data, lastMessage: null };
      dispatch({ type: CREATE_CHATROOM, payload: chatroomObject });
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
export const setActiveChatroom = (roomId, participant, isShop) => (
  dispatch
) => {
  dispatch({ type: LOADING });

  axios
    .get(
      `/api/chat/getMessages/${roomId}`,
      isShop ? shopConfig() : userConfig()
    )
    .then((res) => res.data)
    .then((data) => {
      dispatch({
        type: SET_ACTIVE_CHATROOM,
        payload: { roomId, participant, messages: data },
      });
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

export const receiveMessage = (message) => {
  return { type: RECEIVE_MESSAGE, payload: message };
};

export const forbiddenRoom = () => {
  return { type: FORBIDDEN_ROOM };
};

export const shopConfig = () => {
  const shopToken = localStorage.getItem("shop-token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (shopToken) config.headers["shop-token"] = shopToken;
  return config;
};

export const userConfig = () => {
  const userToken = localStorage.getItem("user-token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (userToken) config.headers["user-token"] = userToken;
  return config;
};
