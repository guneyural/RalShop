import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.png";
import Styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import AddressSection from "../components/checkoutAddress";
import PaymentSection from "../components/checkoutPayment";
import { priceConverter } from "../utils/helpers";

const HeaderSection = Styled.section`
  position:relative;
  margin-left: 10px;
  margin-top:-10px;

  @media (max-width: 500px) {
    margin-left:5px;
  }
`;
const CheckoutNavbarHeader = Styled.h3`
  font-weight:400;
  @media (max-width: 425px) {
    font-size: 21.5px;
  }
`;
const CheckoutNavbarText = Styled.p`
  font-size: 14px;
  margin-top: -8px;
`;
const OrderSummarySection = Styled.section`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  font-size: 15.5px;
  margin: 0;
`;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const Cart = useSelector((state) => state.Cart);
  const [itemsToBuy, setItemsToBuy] = useState(0);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("address");

  useEffect(() => {
    let sum = 0,
      itemSumToBuy = 0;
    Cart.products.forEach((item) => {
      if (item.selected) {
        sum += item.price * item.qty;
        itemSumToBuy += item.qty;
      }
    });
    setTotal(sum);
    setItemsToBuy(itemSumToBuy);
  }, [Cart]);
  useEffect(() => {
    const getNavItems = document.querySelectorAll(".checkout-nav div");
    getNavItems.forEach((navItem) => {
      navItem.classList.remove("checkout-nav-active");
    });
    if (activeTab === "address") {
      getNavItems[0].classList.add("checkout-nav-active");
    }
    if (activeTab === "payment") {
      getNavItems[1].classList.add("checkout-nav-active");
    }
  }, [activeTab]);

  return (
    <div className="checkout-page">
      <div className="checkout-page-header">
        <img src={Logo} alt="UralShop Logo" className="checkout-page-logo" />
        <HeaderSection>
          <h2>Checkout</h2>
          <p className="text-muted">Buying {itemsToBuy} products</p>
        </HeaderSection>
      </div>
      <div className="row mt-4">
        <div className="col-lg-9 col-md-8">
          <div className="checkout-nav">
            <div
              className="checkout-nav-active"
              onClick={() => setActiveTab("address")}
            >
              <CheckoutNavbarHeader>Address</CheckoutNavbarHeader>
              <CheckoutNavbarText>Address information</CheckoutNavbarText>
            </div>
            <div onClick={() => setActiveTab("payment")}>
              <CheckoutNavbarHeader>Payment</CheckoutNavbarHeader>
              <CheckoutNavbarText>You can pay with Stripe</CheckoutNavbarText>
            </div>
          </div>
          {activeTab === "address" ? <AddressSection /> : <PaymentSection />}
        </div>
        <div className="col-lg-3 col-md-4 order-summary-section">
          <button
            className="default-btn w-100"
            onClick={() => setActiveTab("payment")}
          >
            Proceed To Payment
          </button>
          <div className="order-summary-box mt-3">
            <OrderSummarySection>
              <p>Subtotal</p>
              <p>{priceConverter(total)}</p>
            </OrderSummarySection>
            <OrderSummarySection>
              <p>Shipping Fee</p>
              <p>{priceConverter(5.99)}</p>
            </OrderSummarySection>
            <hr />
            <OrderSummarySection>
              <p>Total</p>
              <p>{priceConverter(5.99 + total)}</p>
            </OrderSummarySection>
          </div>
          <div className="order-summary-box mt-4 shipping-info">
            <p>
              You can view and see the status of your orders from your profile.
            </p>
          </div>
          <div className="order-summary-box mt-4 shipping-info">
            <p>You can cancel an order before seller confirms the order.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
