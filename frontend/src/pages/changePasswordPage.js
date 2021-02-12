import React, { useState, useEffect } from "react";
import { CgPassword } from "react-icons/cg";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  confirmPasswordResetCode,
} from "../redux/actions/authActions";
import { cancelForgotPassword } from "../redux/actions/authActions";

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

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState(false);
  const User = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      confirmPasswordResetCode(User.forgotPassword.confirmationCode, true)
    );
  }, []);

  useEffect(() => {
    if (User.forgotPassword.confirmationCodeSuccess === false) {
      window.location.href = `${window.origin}/auth`;
    }
    if (User.forgotPassword.changePasswordSuccess === false) {
      setTimeout(() => {
        window.location.href = `${window.origin}`;
      }, 1000);
    }
  }, [User]);

  useEffect(() => {
    if (newPassword.length > 6 && confirmPassword.length > 6) {
      if (newPassword !== confirmPassword) {
        setErr("Passwords don't match.");
      } else {
        setErr(false);
      }
    } else {
      if (newPassword.length > 0 && confirmPassword.length > 0) {
        setErr("Password must be at least 6 characters.");
      } else {
        setErr(false);
      }
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      changePassword(
        User.forgotPassword.emailOrUsername,
        User.forgotPassword.confirmationCode,
        newPassword,
        confirmPassword
      )
    );
  };

  const cancelForgotPassword = () => {
    dispatch(cancelForgotPassword());
    window.location.href = `${window.origin}/auth`;
  };

  return (
    <CenterDiv>
      <CenterBox>
        <CgPassword
          style={{ display: "grid", margin: "auto", fontSize: "5rem" }}
        />
        <h2 style={{ textAlign: "center" }}>New Password</h2>
        <p
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            fontSize: "15px",
          }}
        >
          Enter your new password and confirm it. Passwor must be more than 6
          characters.
        </p>
        <form style={{ margin: "auto" }} onSubmit={(e) => handleSubmit(e)}>
          <InputField
            type="password"
            name="newPassword"
            id="newPassword"
            value={newPassword}
            aria-label="New password input"
            placeholder="Enter your new password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputField
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            aria-label="Confirm new password input"
            className="mt-3"
            placeholder="Confirm your new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="default-btn mt-5 w-100"
            disabled={
              newPassword.length < 6 || newPassword.length < 6 || User.loading
                ? true
                : false
            }
          >
            {User.loading ? "Loading..." : "Change Password"}
          </button>
          {err && <span className="text-danger">{err}</span>}
          {User.forgotPassword.changePasswordSuccess === true && (
            <span className="text-success">
              Password Changed. Now You Can Login.
            </span>
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
            onClick={() => cancelForgotPassword()}
          >
            Cancel
          </span>
        </SectionBottom>
      </CenterBox>
    </CenterDiv>
  );
};

export default ChangePassword;
