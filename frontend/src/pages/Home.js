import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CategoriesBox from "../components/HomePageCategoriesBox";
import OnlyLoggedInUsers from "../components/HomePageOnlyLoggedInUsers";
import HomePageSection from "../components/HomePageSection";

const HomePage = () => {
  const history = useHistory();
  const { isAuthenticated } = useSelector((state) => state.Auth);

  return (
    <div>
      <CategoriesBox />
      {isAuthenticated && <OnlyLoggedInUsers />}
      <HomePageSection />
    </div>
  );
};

export default HomePage;
