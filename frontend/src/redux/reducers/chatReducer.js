import {
  SEND_MESSAGE,
  CREATE_CHATROOM,
  GET_CHATROOMS,
  GET_MESSAGES,
  SET_ACTIVE_CHATROOM,
  LOADING,
  CHAT_ERROR,
} from "../actions/types";

const initialState = {
  chatrooms: [],
  activeChat: { roomId: null, messages: [] },
  loading: false,
  error: { msg: null, status: null },
};

export function Chat(state = initialState, action) {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        loading: false,
      };
    case CREATE_CHATROOM:
      return {
        ...state,
        loading: false,
      };
    case GET_CHATROOMS:
      return {
        ...state,
        loading: false,
        chatrooms: [...action.payload],
        error: { msg: null, status: null },
      };
    case GET_MESSAGES:
      return {
        ...state,
        loading: false,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_ACTIVE_CHATROOM:
      return {
        ...state,
        loading: false,
      };
    case CHAT_ERROR:
      return {
        ...state,
        loading: false,
        error: { msg: action.payload.msg, status: action.payload.status },
      };
    default:
      return state;
  }
}
