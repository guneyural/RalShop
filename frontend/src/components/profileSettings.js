import React, { useState, useEffect } from "react";
import NoPhoto from "../assets/noProfilePic.jpg";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import Loading from "../assets/loading.gif";
import Modal from "./messageBox";
import {
  updateUserData,
  addProfilePhoto,
  removeProfilePhoto,
} from "../redux/actions/authActions";

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
  const { user, loading, error, userDataUpdated } = useSelector(
    (state) => state.Auth
  );
  const [removePhoto, setRemovePhoto] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeAccountError, setRemoveAccountError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const body = document.querySelector("body");
    if (isModalOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const autoSavePhoto = () => {
    let formData = new FormData();
    let imagefile = document.querySelector(`input[type="file"]`);
    if (!removePhoto && imagefile.files[0] !== undefined)
      formData.append("profilePhoto", imagefile.files[0]);
    dispatch(addProfilePhoto(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserData({ username, email }));
  };

  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    dispatch(removeProfilePhoto());
    setRemovePhoto(false);
  };

  const removeAccount = () => {
    axios
      .post(
        "https://ural-shop.herokuapp.com/api/user/remove",
        { password },
        {
          headers: {
            "user-token": localStorage.getItem("user-token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.data)
      .then((data) => {
        localStorage.removeItem("user-token");
        localStorage.removeItem("Wishlist");
        setRemoveAccountError(null);
        window.location.href = window.origin;
      })
      .catch((err) => {
        setRemoveAccountError(err.response.data.errorMessage);
      });
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          message="Do You Really Want To Delete Your Account?"
          header="Delete Account"
          btnText="Delete My Account"
          action={removeAccount}
          isRedux={false}
        />
      )}
      <StyledSection>
        {!removePhoto ? (
          <img
            src={user && user.hasPhoto ? user.profilePhoto.url : NoPhoto}
            alt="profile"
            className="profile-pic-section settings"
          />
        ) : (
          <img
            src={NoPhoto}
            alt="profile"
            className="profile-pic-section settings"
          />
        )}
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
            onChange={() => autoSavePhoto()}
          />
          <section
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <Colorful onClick={() => handleRemovePhoto()}>
              Remove photo
            </Colorful>
            <span className="text-danger" style={{ fontSize: "13px" }}>
              {removePhoto && "Profile picture will be removed."}
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
        {userDataUpdated && (
          <InfoText className="text-success">
            <b>Changes Saved.</b>
          </InfoText>
        )}
        {error.msg !== null && (
          <InfoText className="text-danger">
            <b>{error.msg}</b>
          </InfoText>
        )}
      </form>
      {loading && <img src={Loading} alt="loading" width="100" />}
      <hr />
      <section className="delete-account">
        <h3 className="text-danger">Delete Account</h3>
        <p className="text-danger">
          This action is irreversible. Once you delete your account all of your
          data will be lost.
        </p>
        <form onSubmit={(e) => openModal(e)}>
          <div className="form-section">
            <label htmlFor="password" className="text-danger">
              <b>Password</b>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="text-danger"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="default-btn text-danger"
            disabled={password.length < 6 ? true : false}
          >
            Delete Account
          </button>
          {removeAccountError !== null && (
            <InfoText className="text-danger">
              <b>{removeAccountError}</b>
            </InfoText>
          )}
        </form>
      </section>
    </div>
  );
};

export default ProfileSettings;
