import React, { useState, useEffect, useRef } from "react";
import Styled from "styled-components";
import io from "socket.io-client";

const ChatCount = Styled.p`
     font-size: 15.5px;
     color: var(--text-muted);
     margin-top: -10px;
`;

const Messenger = () => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("/");
  }, []);

  return (
    <div>
      <h2 className="text-center">UralShop Chat</h2>
      <ChatCount className="text-center">0 Chats</ChatCount>
      <hr />
    </div>
  );
};

export default Messenger;
