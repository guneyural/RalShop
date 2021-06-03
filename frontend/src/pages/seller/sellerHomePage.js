import React from "react";
import Sections from "../../components/seller/sellerHomePageSection";
import Dashboard from "../../components/seller/HomePageDashboard";

const SellerHomePage = () => {
  return (
    <>
      <Sections />
      <h1
        style={{
          marginTop: "40px",
          marginBottom: "25px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Charts
      </h1>
      <Dashboard />
    </>
  );
};

export default SellerHomePage;
