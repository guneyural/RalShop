import React, { useState } from "react";
import NoPhoto from "../assets/noProfilePic.jpg";
import { useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import Loading from "../assets/loading.gif";

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
const InfoText = styled.span`
  display: inline-block;
  margin-left: 10px;
`;

const ProfileSettings = () => {
  const { user } = useSelector((state) => state.Auth);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let imagefile = document.querySelector(`input[type="file"]`);
    if (!removePhoto && imagefile.files[0] !== undefined)
      formData.append("profilePhoto", imagefile.files[0]);
    if (removePhoto) formData.append("removePhoto", removePhoto);
    formData.append("username", username);
    formData.append("email", email);
    setIsLoading(true);
    setIsSuccess(false);
    axios
      .put("/api/user/update", formData, {
        headers: {
          "user-token": localStorage.getItem("user-token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setErr(null);
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = window.origin;
        }, 1500);
      })
      .catch((err) => {
        setErr(err.response.data.errorMessage);
        setIsLoading(false);
        setIsSuccess(false);
      });
  };

  const handleRemovePhoto = () => {
    setRemovePhoto(!removePhoto);
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      <StyledSection>
        <img
          src={user && user.hasPhoto ? user.profilePhoto.url : NoPhoto}
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
          <input className="form-control" type="file" id="formFile" />
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
          <div className="form-text">
            Username must be less than 15 characters. Spaces will be replaced
            with dot(.)
          </div>
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
        {isSuccess && (
          <InfoText className="text-success">
            <b>Changes Saved.</b>
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

export default ProfileSettings;
