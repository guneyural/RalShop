import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, logoutUser } from "../redux/actions/authActions";
import { useParams } from "react-router-dom";
import noPicture from "../assets/noProfilePic.jpg";
import { MdSettings } from "react-icons/md";
import styled from "styled-components";
import moment from "moment";
import { BiLogOut } from "react-icons/bi";

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

  useEffect(() => {
    dispatch(getProfile(username));
  }, [dispatch, username]);

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
        {profile !== null && (
          <section className="profile-section">
            <div className="profile-pic-section">
              {profile.hasPhoto ? (
                <img src="" alt="profile" className="profile-picture" />
              ) : (
                <img
                  src={noPicture}
                  alt="profile"
                  className="profile-picture"
                />
              )}
            </div>
            <div className="profile-body">
              <section>
                <ProfileSection>
                  <h1 className="profile-username">{profile.username}</h1>
                  {user !== null && user._id === profile._id && (
                    <button
                      className="default-btn"
                      onClick={() => dispatch(logoutUser())}
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
                <button className="default-btn settings-btn">
                  <MdSettings />
                  Settings
                </button>
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
