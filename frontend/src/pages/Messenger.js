import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LoadingIcon from "../assets/loading.gif";
import { getChatrooms, setActiveChatroom } from "../redux/actions/chatActions";
import Styled from "styled-components";
import { MdNotifications } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";

const ChatCount = Styled.p`
     font-size: 15.5px;
     color: var(--text-muted);
     margin-top: -10px;
`;
const LoadingGif = Styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  height:100px;
`;
const InfoText = Styled.p`
  margin:auto;
  font-weight:500;
  color: var(--text-muted);
  text-align: center;
`;
const ChatroomBox = Styled.div`
  cursor: pointer;
  display: flex;
  transition: 0.2s;
  padding: 5px;
  &:hover{
    background: #e9e9e9;
  }
  position: relative;
`;
const CompanyName = Styled.p`
  font-weight: 500;
`;
const FullName = Styled.p`
  margin-top: -20px;
  color: var(--text-muted);
  font-size: 15px;
  font-weight:400;
`;
const LastMessage = Styled.p`
  color: var(--text-muted);
  font-weight: 300;
  margin-top: -15px;
`;

const Messenger = () => {
  const history = useHistory();
  const { Chat } = useSelector((state) => state);
  const { inSellerRoute } = useSelector((state) => state.Seller);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChatrooms(inSellerRoute));
  }, []);
  useEffect(() => {
    if (Chat.createdRoom !== null) {
      activeChat(
        Chat.createdRoom.chatroom._id,
        Chat.createdRoom.chatroom.participant
      );
    }
  }, [Chat]);
  useEffect(() => {
    setNotifications(Chat.notifications);
  }, [Chat.notifications]);

  const activeChat = (roomId, participant) => {
    dispatch(setActiveChatroom(roomId, participant, inSellerRoute));
    history.push(
      inSellerRoute
        ? `/chat/seller/message/${roomId}`
        : `/chat/message/${roomId}`
    );
  };

  return (
    <div>
      <h2 className="text-center">UralShop Chat</h2>
      <ChatCount className="text-center">
        {Chat.chatrooms.length} Chats
      </ChatCount>
      <hr />
      <div className="main-area">
        {Chat.loading ? (
          <LoadingGif src={LoadingIcon} alt="loading icon" />
        ) : (
          Chat.chatrooms.length === 0 && <InfoText>No Chat Found</InfoText>
        )}
        {Chat.chatrooms.length >= 1 &&
          Chat.chatrooms.map((room, index) => {
            return (
              <ChatroomBox
                key={index}
                className={
                  notifications.some(
                    (notif) => notif.chatroom === room.chatroom._id
                  )
                    ? "border-bottom chatroom-highlight"
                    : "border-bottom"
                }
                onClick={() =>
                  activeChat(
                    room.chatroom._id,
                    inSellerRoute
                      ? room.chatroom.creator
                      : room.chatroom.participant
                  )
                }
              >
                <section>
                  <BiMessageDetail
                    style={{ height: "30px", width: "30px", marginTop: "50%" }}
                  />
                  {notifications.some(
                    (notification) =>
                      notification.chatroom === room.chatroom._id
                  ) && (
                    <MdNotifications
                      style={{ color: "#c9222b", fontSize: "22px" }}
                    />
                  )}
                </section>
                <section style={{ paddingLeft: "15px", paddingTop: "5px" }}>
                  <CompanyName>
                    {inSellerRoute
                      ? room.chatroom.creator.username
                      : room.chatroom.participant.companyName}
                  </CompanyName>
                  {!inSellerRoute && (
                    <FullName>{room.chatroom.participant.fullname}</FullName>
                  )}
                  {room.lastMessage !== null &&
                    (room.lastMessage.isPhoto ? (
                      <LastMessage>A Photo Has Been Sent</LastMessage>
                    ) : (
                      <LastMessage>
                        {room.lastMessage.body.length > 28
                          ? `${room.lastMessage.body.substring(0, 28)}...`
                          : room.lastMessage.body}
                      </LastMessage>
                    ))}
                </section>
                <HiDotsVertical
                  style={{
                    position: "absolute",
                    right: "0",
                    paddingTop: "5px",
                    fontSize: "24px",
                  }}
                />
              </ChatroomBox>
            );
          })}
      </div>
    </div>
  );
};

export default Messenger;
