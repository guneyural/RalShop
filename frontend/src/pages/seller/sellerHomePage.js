import React from "react";
import Sections from "../../components/seller/sellerHomePageSection";

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
        Dashboard
      </h1>
    </>
  );
};

export default SellerHomePage;
