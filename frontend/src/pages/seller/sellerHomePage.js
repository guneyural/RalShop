import React from "react";
import Sections from "../../components/seller/sellerHomePageSection";
import TotalRevenueChart from "../../components/seller/totalRevenueChart";
import RevenueByMonthChart from "../../components/seller/revenueByMonth";
import OrdersByMonthChart from "../../components/seller/OrdersByMonth";
import StatusesOfOrders from "../../components/seller/StatusesOfOrders";

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
      <hr />
      <div className="row">
        <div className="col-md-6 mt-4">
          <h5 style={{ textAlign: "center" }}>
            <b>Total Revenue Growth By Month</b>
          </h5>
          <TotalRevenueChart />
        </div>
        <div className="col-md-6 mt-4">
          <h5 style={{ textAlign: "center" }}>
            <b>Orders</b>
          </h5>
          <OrdersByMonthChart />
        </div>
        <div className="col-12 mt-4">
          <h5 style={{ textAlign: "center" }}>
            <b>Earned Money By Month</b>
          </h5>
          <RevenueByMonthChart />
        </div>
        <div className="col-md-12 mt-4">
          <h5 style={{ textAlign: "center" }}>
            <b>Statuses Of Orders</b>
          </h5>
          <StatusesOfOrders />
        </div>
      </div>
    </>
  );
};

export default SellerHomePage;
