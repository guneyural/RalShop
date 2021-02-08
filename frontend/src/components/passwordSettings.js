import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Loading from "../assets/loading.gif";

const InfoText = styled.span`
  display: inline-block;
  margin-left: 10px;
`;

const PasswordSettings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    if (
      newPassword.length < 6 ||
      oldPassword.length < 6 ||
      confirmPassword < 6
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }

    if (
      oldPassword.length > 0 &&
      newPassword.length > 0 &&
      oldPassword === newPassword
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }

    if (newPassword !== confirmPassword) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [oldPassword, newPassword, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    setIsLoading(true);
    axios
      .put("/api/user/resetPassword", body, {
        headers: { "user-token": localStorage.getItem("user-token") },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        setIsSuccess(true);
        setErr(null);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        setIsLoading(false);
        setIsSuccess(false);
        setErr(
          err.response.data === "Rate Limit Exceeded."
            ? "You've reached your limit. Try again after a few seconds."
            : err.response.data.errorMessage
        );
      });
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      <h1>Change Password</h1>
      <hr />
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="form-section">
          <label htmlFor="oldPassword">
            <b>Old Password</b>
          </label>
          <input
            type="password"
            name="oldPassword"
            id="oldPassword"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="form-section">
          <label htmlFor="newPassword">
            <b>New Password</b>
          </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="form-text">
            New password must be at least 6 characters.
          </div>
        </div>
        <div className="form-section">
          <label htmlFor="confirmPassword">
            <b>Confirm New Password</b>
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="form-text">Write new password again to confirm.</div>
        </div>
        <button className="default-btn w-25" disabled={disable}>
          Change Password
        </button>
        {isSuccess && (
          <InfoText className="text-success">
            <b>Password Changed.</b>
          </InfoText>
        )}
        {err !== null && (
          <InfoText className="text-danger">
            <b>{err}</b>
          </InfoText>
        )}
      </form>
      {isLoading && <img src={Loading} alt="loading" width="100" />}
    </div>
  );
};

export default PasswordSettings;
