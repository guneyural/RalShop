import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { forbiddenRoom, sendMessage } from "../redux/actions/chatActions";
import { BiLeftArrowAlt, BiMessageDetail, BiSend } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import Styled from "styled-components";
import io from "socket.io-client";

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
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  let { roomId } = useParams();

  useEffect(() => {
    socketRef.current = io.connect("/");
    socketRef.current.emit(
      "user connected",
      inSellerRoute ? Seller.shop._id : Auth.user._id
    );
    socketRef.current.emit("join room", roomId);

    socketRef.current.on("message sent", (message) => {
      console.log(message);
    });
  }, []);

  useEffect(() => {
    socketRef.current.on("user data", (users) => {
      if (Chat.activeChat.participant !== null) {
        if (users[Chat.activeChat.participant._id]) {
          setIsOnline(true);
          console.log("SEN VARYA ");
        } else {
          setIsOnline(false);
          console.log("HOCAM BU HERIF OFFLINE ANASINI SATIM");
        }
      }
    });
  }, [Chat.activeChat]);

  useEffect(() => {
    if (Chat.error.status === 403) {
      dispatch(forbiddenRoom());
      history.push("/chat");
    }
  }, [Chat.error]);

  const sendMessage = (e) => {
    e.preventDefault();
    socketRef.current.emit("send message", message);
  };

  const leftRoomButton = () => {
    socketRef.current.emit("left room", roomId);
    history.push("/chat");
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
                    ? Chat.activeChat.creator.username
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
        {messages.map((message, index) => {
          return <div key={index}>{message}</div>;
        })}
      </div>
      <div className="message-section-bottom">
        <form onSubmit={(e) => sendMessage(e)}>
          <input
            className="message-input"
            type="text"
            name="message-text"
            placeholder="Write a message."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">
            <BiSend style={{ marginTop: "-3px" }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messaging;
