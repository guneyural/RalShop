import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, logoutUser } from "../redux/actions/authActions";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, profile, loading, error } = useSelector((state) => state.Auth);
  const { username } = useParams();

  useEffect(() => {
    dispatch(getProfile(username));
  }, [dispatch, username]);

  if (!loading) {
    if (error.msg !== null) {
      return (
        <div>
          <h1 className="text-danger">{error.msg}</h1>
        </div>
      );
    }
    return (
      <div>
        {profile !== null && (
          <section>
            <h1>{profile.username}</h1>
            {user !== null && user._id === profile._id && (
              <button onClick={() => dispatch(logoutUser())}>Logout</button>
            )}
          </section>
        )}
      </div>
    );
  } else {
    return <h1>Loading...</h1>;
  }
};

export default ProfilePage;
