import React, { useEffect } from "react";

const ProfilePageAddressSection = ({ setIsEmpty }) => {
  useEffect(() => {
    setIsEmpty(true);
  }, []);
  return (
    <div className="navbar-item-container-empty">
      <h1>Address</h1>
    </div>
  );
};

export default ProfilePageAddressSection;
