import React from "react";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";

const Message = styled.p`
  text-align: center;
  font-weight: 500;
`;

const MessageBox = ({
  isRedux,
  action,
  message,
  setIsModalOpen,
  header,
  btnText,
}) => {
  const dispatch = useDispatch();
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAction = () => {
    if (!isRedux) {
      action();
      setIsModalOpen(false);
    } else {
      dispatch(action());
      setIsModalOpen(false);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-box">
        <section className="modal-top">
          <h1>{header}</h1>
          <button onClick={() => closeModal()}>
            <FaTimes />
          </button>
        </section>
        <section className="modal-body">
          <Message>{message}</Message>
          <button className="default-btn" onClick={() => handleAction()}>
            {btnText}
          </button>
        </section>
      </div>
    </div>
  );
};

export default MessageBox;
