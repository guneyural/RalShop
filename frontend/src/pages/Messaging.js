import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { forbiddenRoom } from "../redux/actions/chatActions";

const Messaging = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const Chat = useSelector((state) => state.Chat);

  useEffect(() => {
    if (Chat.error.status === 403) {
      dispatch(forbiddenRoom());
      history.push("/chat");
    }
  }, [Chat.error]);

  return <>This is Messaging Page</>;
};

export default Messaging;
