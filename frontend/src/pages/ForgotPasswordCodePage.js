import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelForgotPassword,
  confirmPasswordResetCode,
} from "../redux/actions/authActions";
import { AiOutlineMail } from "react-icons/ai";

const CenterDiv = styled.div`
  margin-top: 30px;
  @media (max-width: 450px) {
    width: 100%;
  }
`;

const CenterBox = styled.div`
  border: 1px solid #c2c2c2;

  margin: auto;
  padding: 10px 40px;
  width: 400px;
  box-shadow: 2px 2px 10px #dedede;
  position: relative;
  @media (max-width: 450px) {
    width: 100%;
  }
`;

const InputField = styled.input`
  padding: 4px 12px;
  border-radius: 3px;
  background: #fafafa;
  border: 1px solid #c2c2c2;
  width: 100%;
`;

const SectionBottom = styled.section`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #efefef;
  border-top: 1px solid #c2c2c2;
  font-weight: 500;
  text-align: center;
  padding: 7px;
  :hover {
    text-decoration: underline;
  }
`;

const PasswordConfirmation = () => {
  const [passwordCode, setPasswordCode] = useState("");
  const dispatch = useDispatch();
  const User = useSelector((state) => state.Auth);

  useEffect(() => {
    if (User.forgotPassword.confirmationCodeTries === 0) {
      dispatch(cancelForgotPassword());
      window.location.href = `${window.origin}/auth`;
    }
    if (User.forgotPassword.confirmationCodeSuccess) {
      window.location.href = `${window.origin}/account/forgot_password/change_password`;
    }
  }, [User]);

  const confirmCode = (e) => {
    e.preventDefault();
    dispatch(confirmPasswordResetCode(passwordCode));
  };

  const cancelProcess = () => {
    dispatch(cancelForgotPassword());
    window.location.href = `${window.origin}/auth`;
  };

  return (
    <CenterDiv>
      <CenterBox>
        <AiOutlineMail
          style={{ display: "grid", margin: "auto", fontSize: "5rem" }}
        />
        <h2 style={{ textAlign: "center" }}>Confirmation Code</h2>
        <p
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            fontSize: "15px",
          }}
        >
          Enter the confirmation code we sent to your mail. If you didn't get
          mail click cancel.
        </p>
        <form style={{ margin: "auto" }} onSubmit={(e) => confirmCode(e)}>
          <InputField
            type="text"
            name="passwordCode"
            id="passwordCode"
            aria-label="confirmation code input"
            value={passwordCode}
            placeholder="Confirmation Code"
            onChange={(e) => setPasswordCode(e.target.value)}
          />
          <button
            className="default-btn mt-3 w-100"
            disabled={
              passwordCode.length < 8 || User.loading || passwordCode.length > 8
                ? true
                : false
            }
          >
            {User.loading ? "Loading..." : "Confirm Code"}
          </button>
          {User.forgotPassword.confirmationCodeSuccess === false && (
            <span className="text-danger">
              Codes don't match or time expired. Click cancel to take the code
              or try again.
            </span>
          )}
          {User.forgotPassword.confirmationCodeSuccess && (
            <span className="text-success">Codes matched. Proceeding...</span>
          )}
        </form>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "14px",
            fontWeight: "500",
            paddingTop: "30px",
            paddingBottom: "40px",
          }}
        >
          OR
        </p>
        <SectionBottom>
          <span
            to="/auth"
            style={{ color: "var(--primary-text)", textDecoration: "none" }}
            onClick={() => cancelProcess()}
          >
            Cancel
          </span>
        </SectionBottom>
      </CenterBox>
    </CenterDiv>
  );
};

export default PasswordConfirmation;
