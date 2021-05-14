import React, { useEffect } from "react";

const ProfilePageReviewsSection = ({ setIsEmpty }) => {
  useEffect(() => {
    setIsEmpty(false);
  }, []);
  return <h1>Reviews</h1>;
};

export default ProfilePageReviewsSection;
