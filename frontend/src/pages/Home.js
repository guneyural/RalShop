import React from "react";
import Logo from "../assets/logo.png";

const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
      <img src={Logo} alt="logo" style={{ height: "250px" }} />
    </div>
  );
};

export default HomePage;
