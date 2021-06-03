import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSellerOrders } from "../../redux/actions/sellerActions";
import LoadingGif from "../../assets/loading.gif";
import styled from "styled-components";
import Sections from "../../components/seller/sellerHomePageSection";
import TotalRevenueChart from "../../components/seller/totalRevenueChart";
import RevenueByMonthChart from "../../components/seller/revenueByMonth";
import OrdersByMonthChart from "../../components/seller/OrdersByMonth";
import StatusesOfOrders from "../../components/seller/StatusesOfOrders";

const LoadingIcon = styled.img`
  display: block;
  margin: auto;
  height: 80px;
  width: 80px;
`;

const SellerHomePage = () => {
  const { loading, orders } = useSelector((state) => state.Seller);
  const [uniqueOrders, setUniqueOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState(0);
  const [confirmationRequiredOrders, setConfirmedRequiredOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [shippedOrders, setShippedOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [customerRequestedToCancelOrders, setCustomerRequestedToCancelOrders] =
    useState(0);
  const [packingOrders, setPackingOrders] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSellerOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 1) {
      const uniqueLastMonthOrders = Array.from(
        new Set(orders.map((item) => item.groupId))
      ).map((id) => {
        return orders.find((group) => group.groupId === id);
      });

      setUniqueOrders(uniqueLastMonthOrders);
    }
  }, [orders]);

  useEffect(() => {
    uniqueOrders.forEach((item) => {
      let {
        order: { status },
      } = item;

      if (status === "confirmed") setConfirmedOrders((old) => old + 1);
      if (status === "cancelled") setCancelledOrders((old) => old + 1);
      if (status === "waitingConfirmation")
        setConfirmedRequiredOrders((old) => old + 1);
      if (status === "cancelRequest")
        setCustomerRequestedToCancelOrders((old) => old + 1);
      if (status === "packing") setPackingOrders((old) => old + 1);
      if (status === "shipped") setShippedOrders((old) => old + 1);
      if (status === "delivered") setDeliveredOrders((old) => old + 1);
    });
  }, [uniqueOrders]);

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
      {loading ? (
        <LoadingIcon src={LoadingGif} alt="loading spinner" />
      ) : (
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
            <StatusesOfOrders
              confirmed={confirmedOrders}
              confirmationRequired={confirmationRequiredOrders}
              cancelled={cancelledOrders}
              shipped={shippedOrders}
              delivered={deliveredOrders}
              customerRequestedToCancel={customerRequestedToCancelOrders}
              packing={packingOrders}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SellerHomePage;
