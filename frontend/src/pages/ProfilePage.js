import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, logoutUser } from "../redux/actions/authActions";
import { useParams } from "react-router-dom";
import noPicture from "../assets/noProfilePic.jpg";
import { MdSettings } from "react-icons/md";
import styled from "styled-components";
import moment from "moment";
import { BiLogOut } from "react-icons/bi";
import MessageBox from "../components/messageBox";
import { Link } from "react-router-dom";

const TextMuted = styled.p`
  color: var(--text-muted);
  margin-top: -10px;
`;
const ProfileSection = styled.section`
  display: flex;
  align-items: center;
`;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, profile, loading, error } = useSelector((state) => state.Auth);
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [btnText, setBtnText] = useState("");

  useEffect(() => {
    dispatch(getProfile(username));
  }, [dispatch, username]);

  useEffect(() => {
    if (isModalOpen) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "auto";
    }
  }, [isModalOpen]);

  const clickLogout = () => {
    setMessage("Do You Want To Logout?");
    setIsModalOpen(true);
    setModalHeader("Logout ?");
    setBtnText("Logout");
  };

  if (error.msg !== null && error.msg === "User Not Found") {
    return (
      <div>
        <h1 className="text-danger">{error.msg}</h1>
      </div>
    );
  }
  if (
    error.msg !== null &&
    error.msg !== "User Not Found" &&
    error.msg !== "Login To See The Content."
  ) {
    return (
      <div>
        <h1 className="text-danger">Reload The Page</h1>
      </div>
    );
  }
  if (!loading) {
    return (
      <div>
        {isModalOpen && (
          <MessageBox
            action={logoutUser}
            message={message}
            header={modalHeader}
            setIsModalOpen={setIsModalOpen}
            btnText={btnText}
            isModalOpen={isModalOpen}
            isRedux={true}
          />
        )}
        {profile !== null && (
          <section className="profile-section">
            <div className="profile-pic-section">
              <img
                src={profile.hasPhoto ? profile.profilePhoto.url : noPicture}
                alt="profile"
                className="profile-picture"
              />
            </div>
            <div className="profile-body">
              <section>
                <ProfileSection>
                  <h3 className="profile-username">{profile.username}</h3>
                  {user !== null && user._id === profile._id && (
                    <button
                      className="default-btn"
                      onClick={() => clickLogout()}
                    >
                      <BiLogOut /> Logout
                    </button>
                  )}
                </ProfileSection>
                <TextMuted>
                  Member since: {moment(profile.createdAt).format("ll")}
                </TextMuted>
              </section>
              {user !== null && user._id === profile._id && (
                <Link to="/account/settings">
                  <button className="default-btn settings-btn">
                    <MdSettings />
                    Settings
                  </button>
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    );
  } else {
    return <h1>Loading...</h1>;
  }
};

export default ProfilePage;
