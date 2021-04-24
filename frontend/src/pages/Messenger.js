import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LoadingIcon from "../assets/loading.gif";
import { getChatrooms, setActiveChatroom } from "../redux/actions/chatActions";
import Styled from "styled-components";
import io from "socket.io-client";
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
  font-weight:500;
`;

const Messenger = () => {
  const history = useHistory();
  const Chat = useSelector((state) => state.Chat);
  const { inSellerRoute } = useSelector((state) => state.Seller);
  const dispatch = useDispatch();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("/");
    dispatch(getChatrooms(inSellerRoute));
  }, []);

  useEffect(() => {
    if (Chat.createdRoom !== null) {
      activeChat(Chat.createdRoom._id);
    }
  }, [Chat]);

  const activeChat = (roomId) => {
    dispatch(setActiveChatroom(roomId, inSellerRoute));
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
                className="border-bottom"
                onClick={() => activeChat(room._id)}
              >
                <section>
                  <BiMessageDetail
                    style={{ height: "30px", width: "30px", marginTop: "50%" }}
                  />
                </section>
                <section style={{ paddingLeft: "15px", paddingTop: "5px" }}>
                  <CompanyName>{room.participant.companyName}</CompanyName>
                  <FullName>{room.participant.fullname}</FullName>
                  <p>Hocam fiyat düşer mi </p>
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
