import React, { useState } from "react";
import NoPhoto from "../assets/noProfilePic.jpg";
import { useSelector } from "react-redux";
import styled from "styled-components";

const StyledSection = styled.section`
  display: flex;
  align-items: center;
`;
const ColumnSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  @media (max-width: 441px) {
    margin-left: 120px;
  }
  @media (max-width: 340px) {
    margin-left: 90px;
  }
`;
const Colorful = styled.span`
  color: #346eeb;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  font-size: 15px;
`;

const ProfileSettings = () => {
  const { user } = useSelector((state) => state.Auth);
  const [fileData, setFileData] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const getFileData = (e) => {
    const getFile = document.querySelector(`input[type="file"]`);
    setFileData(getFile.files[0]);
    setRemovePhoto(false);
  };

  const handleRemovePhoto = () => {
    setRemovePhoto(!removePhoto);
    setFileData(null);
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      <StyledSection>
        <img
          src={user && user.hasPhoto ? "senbildin" : NoPhoto}
          alt="profile"
          className="profile-pic-section settings"
        />
        <ColumnSection>
          <h2>{user.username}</h2>
          <label
            htmlFor="formFile"
            style={{ fontSize: "15px", marginBottom: "0px" }}
            className="form-label"
          >
            Change Profile picture
          </label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={(e) => getFileData(e)}
          />
          <section
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <Colorful onClick={() => handleRemovePhoto()}>
              Remove Photo
            </Colorful>
            <span className="text-danger" style={{ fontSize: "13px" }}>
              {removePhoto &&
                "Profile picture will be removed if you save changes"}
            </span>
          </section>
        </ColumnSection>
      </StyledSection>
      <hr />
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="form-section">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="form-text">Spaces will be replaced with dot(.)</div>
        </div>
        <div className="form-section">
          <label htmlFor="username">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="form-text">
            If you change your mail address, we'll send notification to both old
            mail address and new mail address.
          </div>
        </div>
        <button className="default-btn w-25">Save</button>
      </form>
    </div>
  );
};

export default ProfileSettings;
