import React, { useEffect } from "react";

const ProfilePageOrderSection = ({ setIsEmpty }) => {
  useEffect(() => {
    setIsEmpty(false);
  }, []);
  return <h1>Orders</h1>;
};

export default ProfilePageOrderSection;
