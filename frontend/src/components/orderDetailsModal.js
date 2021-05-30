import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createChatroom } from "../redux/actions/chatActions";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { priceConverter } from "../utils/helpers";
import moment from "moment";

const FullPageBackground = styled.div`
  position: fixed;
  z-index: 99999999;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
`;
const ModalBox = styled.div`
  background: white;
  border-radius: 3px;
  border: 1.3px solid #dbdbdb;
  width: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 90%;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #dddddd;
  }
  &::-webkit-scrollbar-thumb {
    background: #acaaaa;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #c2c2c2;
  }
  @media (max-width: 430px) {
    width: 100%;
  }
`;
const ModalBoxTop = styled.div`
  padding: 3px 8px;
  border-bottom: 1.3px solid #dbdbdb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  transition: 0.3s;
  &:focus {
    outline: 0;
  }
  &:hover {
    background: #dedede;
  }
`;
const ModalBoxTitle = styled.h5`
  font-weight: bold;
  margin: 0;
  padding: 0;
  margin-top: 2px;
`;
const OrderDetailBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  margin: 15px 20px;
  padding: 8px 12px;
  box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  -webkit-box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  -moz-box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  @media (max-width: 500px) {
    padding: 4px 10px;
  }
`;
const OrderItemPrice = styled.span`
  display: block;
  font-size: 14px;
  text-align: center;
  padding: 0;
`;
const AddressBox = styled.div`
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  margin: 15px 20px;
  margin-top: 5px;
  height: 180px;
  box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  -webkit-box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  -moz-box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  overflow: hidden;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #dddddd;
  }
  &::-webkit-scrollbar-thumb {
    background: #acaaaa;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #c2c2c2;
  }
`;
const AddressBoxTop = styled.div`
  border-bottom: 1px solid #dbdbdb;
  margin: 0;
  padding: 5px 10px;
  background: #efefef;
  display: flex;
  justify-content: space-between;
`;
const AddressBoxInner = styled.div`
  padding: 5px 10px;
  font-size: 15px;
  word-wrap: break-word;
  whitespace: pre-wrap;
  overflow: hidden;
`;
const InnerItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: var(--text-muted);
  align-items: center;
  padding-top: 3px;
`;
const OrderItem = styled.div`
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 3px 8px;
  position: relative;
`;
const OrderItemImage = styled.img`
  width: 100%;
  height: 70px;
  object-fit: contain;
`;

const OrderDetailsModal = ({ setIsOrderDetailsModalOpen, orderGroup }) => {
  const dispatch = useDispatch();
  const { inSellerRoute } = useSelector((state) => state.Seller);
  const history = useHistory();

  useEffect(() => {
    window.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && setIsOrderDetailsModalOpen(false)
    );
  }, [setIsOrderDetailsModalOpen]);

  const communicateSeller = (shopId) => {
    dispatch(createChatroom(shopId, inSellerRoute));
    history.push("/chat");
  };

  return (
    <FullPageBackground>
      <ModalBox>
        <ModalBoxTop>
          <ModalBoxTitle>Order Details</ModalBoxTitle>
          <CloseButton onClick={() => setIsOrderDetailsModalOpen(false)}>
            <FaTimes />
          </CloseButton>
        </ModalBoxTop>
        <OrderDetailBox>
          <div>
            <OrderItemPrice style={{ color: "var(--text-muted)" }}>
              <b>Date</b>
            </OrderItemPrice>
            <OrderItemPrice>
              {moment(orderGroup[0].order.createdAt).format("ll")}
            </OrderItemPrice>
          </div>
          <div>
            <OrderItemPrice style={{ color: "var(--text-muted)" }}>
              <b>Products</b>
            </OrderItemPrice>
            <OrderItemPrice>{orderGroup.length} Items</OrderItemPrice>
          </div>
          <div>
            <OrderItemPrice style={{ color: "var(--text-muted)" }}>
              <b>Price</b>
            </OrderItemPrice>
            <OrderItemPrice>
              {priceConverter(orderGroup[0].order.totalAmount)}
            </OrderItemPrice>
          </div>
        </OrderDetailBox>
        <div className="row">
          <div className="col-md-6">
            <AddressBox>
              <AddressBoxTop>
                <p style={{ margin: "0" }}>
                  <b>Delivery Address</b>
                </p>
              </AddressBoxTop>
              <AddressBoxInner>
                <span>
                  {orderGroup[0].order.deliveryAddress.name}{" "}
                  {orderGroup[0].order.deliveryAddress.surname}
                </span>
                <br />
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {orderGroup[0].order.deliveryAddress.state}/
                  {orderGroup[0].order.deliveryAddress.city} -{" "}
                  {orderGroup[0].order.deliveryAddress.country}
                </span>
                <br />
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {orderGroup[0].order.deliveryAddress.phoneNumber}
                </span>
                <br />
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {orderGroup[0].order.deliveryAddress.email}
                </span>
                <br />
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {orderGroup[0].order.deliveryAddress.address}
                </span>
              </AddressBoxInner>
            </AddressBox>
          </div>
          <div className="col-md-6">
            <AddressBox>
              <AddressBoxTop>
                <p style={{ margin: "0" }}>
                  <b>Billing Address</b>
                </p>
              </AddressBoxTop>
              <AddressBoxInner>
                <span>
                  {orderGroup[0].order.billingAddress.name}{" "}
                  {orderGroup[0].order.billingAddress.surname}
                </span>
                <br />
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {orderGroup[0].order.billingAddress.state}/
                  {orderGroup[0].order.billingAddress.city} -{" "}
                  {orderGroup[0].order.billingAddress.country}
                </span>
                <br />
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {orderGroup[0].order.billingAddress.phoneNumber}
                </span>
                <br />
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {orderGroup[0].order.billingAddress.email}
                </span>
                <br />
                <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {orderGroup[0].order.billingAddress.address}
                </span>
              </AddressBoxInner>
            </AddressBox>
          </div>
          <div className="col-md-6">
            <AddressBox>
              <AddressBoxTop>
                <b>Payment Information</b>
              </AddressBoxTop>
              <AddressBoxInner>
                <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                  <>
                    Paid with{" "}
                    {orderGroup[0].Payment.payment_method_details.type}{" "}
                  </>
                  <b style={{ color: "#333" }}>
                    {orderGroup[0].Payment.payment_method_details.card.brand} -
                    ****
                    {orderGroup[0].Payment.payment_method_details.card.last4}
                  </b>
                </InnerItem>
                <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                  <span>Total Amount</span>
                  <b style={{ color: "#333" }}>
                    {priceConverter(orderGroup[0].Payment.amount / 100 - 4.99)}
                  </b>
                </InnerItem>
                <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                  <>Shipping Fee</>
                  <b style={{ color: "#333" }}>{priceConverter(4.99)}</b>
                </InnerItem>
                <InnerItem>
                  <>Total</>
                  <b style={{ color: "#333", fontSize: "16px" }}>
                    {priceConverter(orderGroup[0].Payment.amount / 100)}
                  </b>
                </InnerItem>
              </AddressBoxInner>
            </AddressBox>
          </div>
          <div className="col-md-6">
            <AddressBox>
              <AddressBoxTop>
                <b>Seller Information</b>
                {!inSellerRoute && (
                  <span
                    style={{ fontSize: "14px", cursor: "pointer" }}
                    onClick={() =>
                      communicateSeller(orderGroup[0].order.seller._id)
                    }
                  >
                    Send Message
                  </span>
                )}
              </AddressBoxTop>
              <AddressBoxInner>
                <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                  <>Name</>
                  <b style={{ color: "#333" }}>
                    {orderGroup[0].order.seller.fullname}
                  </b>
                </InnerItem>
                <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                  <>Company</>
                  <b style={{ color: "#333" }}>
                    {orderGroup[0].order.seller.companyName}
                  </b>
                </InnerItem>
                <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                  <>Email</>
                  <b style={{ color: "#333" }}>
                    {orderGroup[0].order.seller.email}
                  </b>
                </InnerItem>
                <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                  <>Phone</>
                  <b style={{ color: "#333" }}>
                    {orderGroup[0].order.seller.phoneNumber}
                  </b>
                </InnerItem>
                <InnerItem>
                  <>Rating</>
                  <b style={{ color: "#333" }}>
                    {orderGroup[0].order.seller.rating}
                  </b>
                </InnerItem>
              </AddressBoxInner>
            </AddressBox>
          </div>
          <div className="col-12">
            <AddressBox style={{ overflowY: "auto" }}>
              <AddressBoxTop>
                <b>Products</b>
              </AddressBoxTop>
              <AddressBoxInner>
                <div className="row">
                  {orderGroup.map((order, index) => {
                    return (
                      <div className="col-md-4 col-sm-6" key={index}>
                        <OrderItem>
                          <OrderItemImage
                            src={order.order.Product.product.images[0].url}
                            alt="product"
                          />
                          <span
                            style={{
                              fontSize: "14px",
                              color: "var(--text-muted)",
                            }}
                          >
                            <b style={{ color: "#333" }}>Status:</b>
                            {order.order.status === "waitingConfirmation" &&
                              "Waiting confirmation by seller"}
                            {order.order.status === "cancelRequest" &&
                              "Waiting confirmation by seller to confirm cancellation"}
                            {order.order.status === "confirmed" &&
                              "Order confirmed by the seller"}
                            {order.order.status === "cancelled" &&
                              "Order is cancelled"}
                          </span>
                        </OrderItem>
                      </div>
                    );
                  })}
                </div>
              </AddressBoxInner>
            </AddressBox>
          </div>
        </div>
      </ModalBox>
    </FullPageBackground>
  );
};

export default OrderDetailsModal;
