import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { forbiddenRoom, receiveMessage } from "../redux/actions/chatActions";
import { BiLeftArrowAlt, BiMessageDetail, BiSend } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import Styled from "styled-components";
import io from "socket.io-client";
import moment from "moment";

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
  let { roomId } = useParams();

  useEffect(() => {
    if (Chat.activeChat.participant !== null) setIsParticipantLoaded(true);
  }, [Chat.activeChat.participant]);

  useEffect(() => {
    if (isParticipantLoaded) {
      socketRef.current = io.connect("/");
      socketRef.current.emit(
        "user connected",
        inSellerRoute ? Seller.shop.id : Auth.user._id
      );
      socketRef.current.emit("join room", roomId);

      socketRef.current.on("message sent", (receivedMessage) => {
        dispatch(receiveMessage(receivedMessage));

        // Scroll to bottom when message received
        let messageContainer = document.querySelector(
          ".message-section-center"
        );
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });

      // Check if the participant is online
      receiveUserData();

      socketRef.current.on("error", (errorMsg) => setErrorMessage(errorMsg));
    }
  }, [isParticipantLoaded]);

  useEffect(() => {
    // When messages loaded on startup scroll to bottom
    let messageContainer = document.querySelector(".message-section-center");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [Chat.activeChat.messages]);

  useEffect(() => {
    if (Chat.error.status === 403) {
      dispatch(forbiddenRoom());
      history.push("/chat");
    }
  }, [Chat.error]);

  function receiveUserData() {
    socketRef.current.on("user data", (users) => {
      console.log("AZ ÖNCE DURUMUNU KONTROL ETTİM");
      if (Chat.activeChat.participant !== null) {
        console.log(users);
        if (users[Chat.activeChat.participant._id]) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      }
    });
  }

  const sendMessage = (e) => {
    e.preventDefault();
    if (Chat.activeChat.participant !== null) {
      const messageObject = {
        sender: inSellerRoute ? Seller.shop._id : Auth.user._id,
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
      }
    }
  };

  const leftRoomButton = () => {
    socketRef.current.emit("left room", roomId);
    history.push(inSellerRoute ? "/chat/seller" : "/chat");
  };

  const keyDownListener = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      sendMessage(e);
    }
  };

  return (
    <div className="message-section">
      <div className="message-section-top">
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
                  ? message.sender === Seller.shop._id
                    ? "right"
                    : ""
                  : message.sender === Auth.user._id
                  ? "right"
                  : ""
              }`}
            >
              <div className="chat-box">
                <p>{message.body}</p>
                <span className="message-date">
                  {moment(message.createdAt).format("LT")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="message-section-bottom">
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <form onSubmit={(e) => sendMessage(e)} autocomplete="off">
          <textarea
            className="message-input"
            type="text"
            name="message-text"
            placeholder="Write a message."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => keyDownListener(e)}
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
