import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingIcon from "../assets/loading.gif";
import { getChatrooms } from "../redux/actions/chatActions";
import Styled from "styled-components";
import io from "socket.io-client";

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

const Messenger = () => {
  const Chat = useSelector((state) => state.Chat);
  const { inSellerRoute } = useSelector((state) => state.Seller);
  const dispatch = useDispatch();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("/");
    dispatch(getChatrooms(inSellerRoute ? true : false));
  }, []);

  return (
    <div>
      <h2 className="text-center">UralShop Chat</h2>
      <ChatCount className="text-center">
        {Chat.chatrooms.length} Chats
      </ChatCount>
      <hr />
      <div className="main-area">
        {Chat.loading && <LoadingGif src={LoadingIcon} alt="loading icon" />}
        {Chat.chatrooms.length < 1 ? <InfoText>No Chat Found</InfoText> : ""}
      </div>
    </div>
  );
};

export default Messenger;
