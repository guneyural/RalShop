import React, { useEffect } from "react";

const ProfilePageRatedSellersSection = ({ isEmpty, setIsEmpty }) => {
  useEffect(() => {
    setIsEmpty(true);
  }, []);

  if (isEmpty) {
    return <h4>No Sellers Rated</h4>;
  }

  return <h1>Güney Ural</h1>;
};

export default ProfilePageRatedSellersSection;
