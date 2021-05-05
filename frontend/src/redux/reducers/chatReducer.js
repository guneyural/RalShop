import {
  RECEIVE_MESSAGE,
  CREATE_CHATROOM,
  GET_CHATROOMS,
  SET_ACTIVE_CHATROOM,
  FORBIDDEN_ROOM,
  LOADING,
  CHAT_ERROR,
  GET_CHATROOM_MESSAGES,
  GET_NOTIFICATIONS,
} from "../actions/types";

const initialState = {
  chatrooms: [],
  createdRoom: null,
  activeChat: { roomId: null, participant: null, messages: [] },
  loading: false,
  notifications: [],
  error: { msg: null, status: null },
};

export function Chat(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_MESSAGE:
      return {
        ...state,
        activeChat: {
          ...state.activeChat,
          messages: [...state.activeChat.messages, action.payload],
        },
        loading: false,
      };
    case CREATE_CHATROOM:
      return {
        ...state,
        loading: false,
        createdRoom: action.payload,
        chatrooms: [action.payload, ...state.chatrooms],
        error: { msg: null, status: null },
      };
    case GET_CHATROOM_MESSAGES:
      return {
        ...state,
        loading: false,
        error: { msg: null, status: null },
        activeChat: {
          ...state.activeChat,
          messages: action.payload.reverse(),
        },
      };
    case GET_CHATROOMS:
      let tempRooms =
        state.createdRoom !== null
          ? [state.createdRoom, ...action.payload]
          : [...action.payload];
      return {
        ...state,
        loading: false,
        chatrooms: [...tempRooms],
        error: { msg: null, status: null },
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case FORBIDDEN_ROOM:
      return {
        ...state,
        loading: false,
        createdRoom: null,
        activeChat: { roomId: null, participant: null, messages: [] },
        error: { msg: null, status: null },
      };
    case SET_ACTIVE_CHATROOM:
      return {
        ...state,
        loading: false,
        createdRoom: null,
        activeChat: {
          ...state.activeChat,
          roomId: action.payload.roomId,
          participant: action.payload.participant,
        },
        error: { msg: null, status: null },
      };
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
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
