import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  forbiddenRoom,
  receiveMessage,
  getChatroomMessages,
  shopConfig,
  userConfig,
} from "../redux/actions/chatActions";
import { AiFillEye } from "react-icons/ai";
import { BiLeftArrowAlt, BiMessageDetail, BiSend } from "react-icons/bi";
import { MdPhotoCamera } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import Styled from "styled-components";
import io from "socket.io-client";
import moment from "moment";
import axios from "axios";

const CompanyName = Styled.p`
  font-weight: 500;
`;
const FullName = Styled.p`
  margin-top: -20px;
  color: var(--text-muted);
  font-size: 15px;
  font-weight:500;
`;
const ActiveIndicator = Styled.div`
  padding: 0 !important;
  margin: 0 !important;  
  height: 10px;
  width: 10px;
  border-radius:50%;
  margin-left: 3px !important;
`;
const TypingInformation = Styled.p`
  font-size: 15px;
  color: var(--text-muted);
  position: absolute;
  top: 20px;
`;
const IsPhotoSending = Styled.p`
  text-align: right;
  font-size: 15px;
  color: var(--text-muted);
`;

const Messaging = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { Seller, Auth } = useSelector((state) => state);
  const Chat = useSelector((state) => state.Chat);
  const { inSellerRoute } = useSelector((state) => state.Seller);
  const socketRef = useRef();
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isParticipantLoaded, setIsParticipantLoaded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isTextareaDisabled, setIsTextAreaDisabled] = useState(true);
  const [isUnreadMessage, setIsUnreadMessage] = useState(false);
  const [unreadMessageLength, setUnreadMessageLength] = useState(0);
  let { roomId } = useParams();

  useEffect(() => {
    return history.listen((location) => {
      socketRef.current.emit("left room", roomId);
    });
  }, [history]);
  useEffect(() => {
    if (Chat.activeChat.participant !== null) setIsParticipantLoaded(true);
  }, [Chat.activeChat.participant]);
  useEffect(() => {
    if (isParticipantLoaded) {
      socketRef.current = io.connect("https://ural-shop.herokuapp.com/");
      socketRef.current.emit(
        "user connected",
        inSellerRoute ? Seller.shop.id : Auth.user._id
      );
      socketRef.current.emit("join room", roomId);

      socketRef.current.on("get chat messages", () => {
        dispatch(getChatroomMessages(roomId, inSellerRoute));
      });

      setIsTextAreaDisabled(false);

      socketRef.current.on("message sent", (receivedMessage) => {
        setIsPhotoLoading(false);
        dispatch(receiveMessage(receivedMessage));

        // Scroll to bottom when message received
        let messageContainer = document.querySelector(
          ".message-section-center"
        );
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });

      // Check if the participant is online
      receiveUserData();

      socketRef.current.on("typing", (isTyping) =>
        isTyping ? setIsTyping(true) : setIsTyping(false)
      );

      window.onbeforeunload = function () {
        socketRef.current.emit("left room", roomId);
      };

      socketRef.current.on("error", (errorMsg) => setErrorMessage(errorMsg));
    }
  }, [isParticipantLoaded]);
  useEffect(() => {
    Chat.activeChat.messages.forEach((message) => {
      if (inSellerRoute) {
        if (message.receiver === Seller.shop.id && !message.seen) {
          setIsUnreadMessage(true);
        }
      } else {
        if (message.receiver === Auth.user._id && !message.seen) {
          setIsUnreadMessage(true);
        }
      }
    });
  }, [Chat.activeChat.messages]);
  useEffect(() => {
    if (isUnreadMessage === true) {
      const getUnreadMessages = document.querySelectorAll(".unread-message");
      const getUnreadMessageNotificationText =
        document.querySelector(".unread-message");
      const getFirstUnreadMessage = document.querySelector(".unread-wrapper");
      getFirstUnreadMessage.classList.add("show");
      setUnreadMessageLength(getUnreadMessages.length);
      let messageContainer = document.querySelector(".message-section-center");
      messageContainer.scroll(0, getUnreadMessageNotificationText.offsetTop);

      setTimeout(() => {
        socketRef.current.emit("message seen");
        setIsUnreadMessage(false);
        setUnreadMessageLength(0);
        getFirstUnreadMessage.classList.remove("show");
      }, 5000);
    }
  }, [isUnreadMessage]);
  useEffect(() => {
    // When messages loaded on startup scroll to bottom
    let messageContainer = document.querySelector(".message-section-center");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [Chat.activeChat.messages, isPhotoLoading]);
  useEffect(() => {
    if (Chat.error.status === 403) {
      dispatch(forbiddenRoom());
      history.push("/chat");
    }
  }, [Chat.error]);
  function receiveUserData() {
    socketRef.current.on("user data", (users) => {
      if (Chat.activeChat.participant !== null) {
        if (users[Chat.activeChat.participant._id]) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      }
    });
  }
  const sendMessage = (e) => {
    setIsPhotoLoading(true);
    e.preventDefault();
    if (Chat.activeChat.participant !== null) {
      const messageObject = {
        sender: inSellerRoute ? Seller.shop.id : Auth.user._id,
        receiver: Chat.activeChat.participant._id,
        chatroom: roomId,
        createdAt: Date.now(),
        body: message,
      };

      // Clear message input
      setMessage("");

      if (message.length > 0) {
        // Send message
        socketRef.current.emit("send message", messageObject);
        stopTyping(e);
      }
    }
  };
  const leftRoomButton = () => {
    socketRef.current.emit("left room", roomId);
    history.push(inSellerRoute ? "/chat/seller" : "/chat");
  };
  const keyDownListener = (e) => {
    socketRef.current.emit("start typing");
    if (e.keyCode === 13 && !e.shiftKey) {
      sendMessage(e);
    }
  };
  function stopTyping(e) {
    socketRef.current.emit("stop typing");
  }
  function selectFile(e) {
    if (e.target.files[0]) {
      setIsPhotoLoading(true);
      setMessage(e.target.files[0].name);
      let formData = new FormData();
      formData.append("sender", inSellerRoute ? Seller.shop.id : Auth.user._id);
      formData.append("receiver", Chat.activeChat.participant._id);
      formData.append("chatroom", roomId);
      formData.append("image", e.target.files[0]);

      axios
        .post(
          "https://ural-shop.herokuapp.com/api/chat/sendImage",
          formData,
          inSellerRoute ? shopConfig() : userConfig()
        )
        .then((res) => res.data)
        .then((data) => {
          socketRef.current.emit("send message", data);
        })
        .catch((err) => setIsPhotoLoading(false));
    }
  }

  return (
    <div className="message-section">
      <div className={`message-section-top ${!inSellerRoute && "not-seller"}`}>
        <section style={{ display: "flex", alignItems: "center" }}>
          <BiLeftArrowAlt
            onClick={() => leftRoomButton()}
            style={{ fontSize: "30px", cursor: "pointer" }}
            className="chat-back-button"
          />
          <BiMessageDetail style={{ fontSize: "25px", marginLeft: "10px" }} />
          {Chat.activeChat.participant !== null ? (
            <>
              <ActiveIndicator
                style={
                  isOnline ? { background: "green" } : { background: "gray" }
                }
              ></ActiveIndicator>
              <section
                style={{ marginLeft: "8px", position: "relative", top: "8px" }}
              >
                <CompanyName>
                  {inSellerRoute
                    ? Chat.activeChat.participant.username
                    : Chat.activeChat.participant.companyName}
                </CompanyName>
                {!inSellerRoute && (
                  <FullName>{Chat.activeChat.participant.fullname}</FullName>
                )}
                {isTyping && (
                  <TypingInformation className="typing-status">
                    typing...
                  </TypingInformation>
                )}
              </section>
            </>
          ) : (
            "Loading..."
          )}
        </section>
        <section>
          <div className="chat-settings">
            <button className="chat-settings-btn">
              <HiDotsVertical style={{ fontSize: "20px" }} />
            </button>
            <div className="chat-settings-list">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        </section>
      </div>
      <div className="message-section-center">
        {Chat.activeChat.messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`chat-box-container ${
                inSellerRoute
                  ? message.sender === Seller.shop.id
                    ? "right"
                    : ""
                  : message.sender === Auth.user._id
                  ? "right"
                  : ""
              } ${
                inSellerRoute
                  ? message.receiver === Seller.shop.id &&
                    !message.seen &&
                    "unread-message"
                  : message.receiver === Auth.user._id &&
                    !message.seen &&
                    "unread-message"
              }`}
            >
              {inSellerRoute
                ? message.receiver === Seller.shop.id &&
                  !message.seen && (
                    <div className="unread-wrapper" id="unread-message-id">
                      <div className="unread-message-section">
                        You Have {unreadMessageLength} Unread Messages
                      </div>
                    </div>
                  )
                : message.receiver === Auth.user._id &&
                  !message.seen && (
                    <div className="unread-wrapper" id="unread-message-id">
                      <div className="unread-message-section">
                        You Have {unreadMessageLength} Unread Messages
                      </div>
                    </div>
                  )}
              <div className="chat-box">
                {message.isPhoto ? (
                  <div>
                    <img
                      src={message.photo.photoUrl}
                      alt="user message"
                      className="chat-picture"
                    />
                  </div>
                ) : (
                  <p>{message.body}</p>
                )}
                <section className="message-box-bottom">
                  <span className="seen-mark">
                    {inSellerRoute
                      ? message.sender === Seller.shop.id &&
                        message.seen && <AiFillEye />
                      : message.sender === Auth.user._id &&
                        message.seen && <AiFillEye />}
                  </span>
                  <span className="message-date">
                    {moment(message.createdAt).format("LT")}
                  </span>
                </section>
              </div>
            </div>
          );
        })}
        {isPhotoLoading && <IsPhotoSending>Message Sending...</IsPhotoSending>}
        {Chat.loading && <IsPhotoSending>Loading...</IsPhotoSending>}
      </div>
      <div className="message-section-bottom">
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <form
          onSubmit={(e) => sendMessage(e)}
          autocomplete="off"
          enctype="multipart/form-data"
        >
          <textarea
            className="message-input"
            type="text"
            name="message-text"
            placeholder="Write a message."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => keyDownListener(e)}
            onBlur={(e) => stopTyping(e)}
            disabled={isTextareaDisabled}
          />
          <label for="file-upload" class="custom-file-upload">
            <MdPhotoCamera style={{ marginTop: "-2px" }} />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => selectFile(e)}
            disabled={isTextareaDisabled}
          />
          <button type="submit" disabled={message.length > 0 ? false : true}>
            <BiSend style={{ marginTop: "-3px" }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messaging;
