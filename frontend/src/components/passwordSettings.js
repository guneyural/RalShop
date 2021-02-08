import React, { useState } from "react";

const PasswordSettings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div style={{ paddingTop: "10px" }}>
      <h1>Change Password</h1>
      <hr />
      <form onSubmit={(e) => e.preventDefault()}>
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
        </div>
        <button className="default-btn w-25">Change Password</button>
      </form>
    </div>
  );
};

export default PasswordSettings;
