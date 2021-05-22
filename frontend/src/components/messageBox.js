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
  param,
  secondParam,
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
      const parameters = {};
      if (param) parameters["param"] = param;
      if (secondParam) parameters["secondParam"] = secondParam;
      dispatch(
        action(
          ...Object.keys(parameters).map((key) => {
            return parameters[key];
          })
        )
      );
      setIsModalOpen(false);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-box">
        <section className="modal-top">
          <h2>{header}</h2>
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
