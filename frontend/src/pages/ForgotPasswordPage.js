import React, { useState, useEffect } from "react";
import { AiOutlineLock } from "react-icons/ai";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordEmail } from "../redux/actions/authActions";
import { Link } from "react-router-dom";

const CenterDiv = styled.div`
  margin-top: 30px;
  @media (max-width: 450px) {
    width: 100%;
  }
`;

const CenterBox = styled.div`
  border: 1px solid #c2c2c2;
  background: white;
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

const ForgotPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const User = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const sendCode = (e) => {
    e.preventDefault();
    dispatch(sendForgotPasswordEmail(emailOrUsername));
  };

  useEffect(() => {
    if (User.forgotPassword.isPasswordReset) {
      window.location.href = `${window.origin}/account/forgot_password/confirmation`;
      localStorage.setItem("password_reset", true);
      if (emailOrUsername !== "")
        localStorage.setItem("emailOrUsername", emailOrUsername);
    }
  }, [User, dispatch]);

  return (
    <CenterDiv>
      <CenterBox>
        <AiOutlineLock
          style={{ display: "grid", margin: "auto", fontSize: "5rem" }}
        />
        <h2 style={{ textAlign: "center" }}>Forgot Password?</h2>
        <p
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            fontSize: "15px",
          }}
        >
          Enter your email or username and we'll send you a code to get your
          account back.
        </p>
        <form style={{ margin: "auto" }} onSubmit={(e) => sendCode(e)}>
          <InputField
            type="text"
            name="emailOrUsername"
            id="emailOrUsername"
            aria-label="email or username input"
            value={emailOrUsername}
            placeholder="Email or Username"
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <button
            className="default-btn mt-3 w-100"
            disabled={emailOrUsername.length < 1 || User.loading ? true : false}
          >
            {User.loading ? "Loading..." : "Send Login Code"}
          </button>
          {User.forgotPassword.sendEmailSuccess === false && (
            <span className="text-danger">Account Does Not Exist.</span>
          )}
          {User.forgotPassword.sendEmailSuccess && (
            <span className="text-success">Email Has Been Sent.</span>
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
          <Link
            to="/auth"
            style={{ color: "var(--primary-text)", textDecoration: "none" }}
          >
            Back To Login Page
          </Link>
        </SectionBottom>
      </CenterBox>
    </CenterDiv>
  );
};

export default ForgotPassword;
