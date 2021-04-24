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
  createdRoom: null,
  activeChat: { roomId: null, messages: [] },
  loading: false,
  error: { msg: null, status: null },
};

/*

  Chatroom Id geçerli mi kontrol et
  Chatroom ID ile bul yoksa redirect et /chat sayfasına
  Request Headerındaki kullanıcının ID'si creator ya da participantId ile eşleşiyorsa devam et yoksa /chat sayfasına redirect
  Mesajlaşma sayfası açılınca bütün mesajları bir daha fetch et
  Mesajlaşma sayfası açılınca socket'i bağla

*/

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
        createdRoom: action.payload,
        chatrooms: [action.payload, ...state.chatrooms],
        error: { msg: null, status: null },
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
        activeChat: { roomId: null, messages: [] },
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
        createdRoom: null,
        activeChat: {
          roomId: action.payload.roomId,
          messages: [...action.payload.messages],
        },
        error: { msg: null, status: null },
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
