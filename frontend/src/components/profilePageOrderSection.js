import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingIcon from "../assets/loading.gif";
import styled from "styled-components";
import { priceConverter } from "../utils/helpers";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdInfoOutline,
} from "react-icons/md";
import OrderDetailsModal from "./orderDetailsModal";
import SellerDetailsModal from "./sellerDetailsModal";
import ReactStars from "react-rating-stars-component";
import {
  rateSeller,
  deleteSellerRating,
} from "../redux/actions/rateSellerActions";
import { orderCancelRequest } from "../redux/actions/orderActions";
import Modal from "./messageBox";

const OrderBox = styled.div`
  border: 1px solid #dbdbdb;
`;
const OrderBoxTop = styled.div`
  border-bottom: 1.3px solid #dbdbdb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const BoxHeaderText = styled.span`
  font-size: 14px;
  font-weight: bold;
`;
const OrderHighlight = styled.span`
  font-size: 14px;
`;
const OrderItem = styled.div`
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  width: 82%;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 3px 8px;
  height: 290px;
  position: relative;
  @media (max-width: 375px) {
    width: 98%;
  }
  @media (max-width: 1000px) {
    height: 320px;
  }
  @media (max-width: 767px) {
    width: 94%;
    height: 265px;
  }
  @media (max-width: 500px) {
    height: 280px;
  }
  @media (max-width: 375px) {
    width: 96%;
    height: 300px;
  }
  @media (max-width: 360px) {
    height: 320px;
  }
`;
const OrderItemImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: contain;
`;
const OrderItemTitle = styled.p`
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 5px;
`;
const OrderItemPrice = styled.p`
  font-size: 15px;
  font-weight: bold;
  margin-top: -12px;
`;
const OrderItemColorAndQty = styled.span`
  display: inline-block;
  font-size: 13.5px;
  font-weight: normal;
  position: relative;
  bottom: 2px;
  color: var(--text-muted);
`;
const ColorPreview = styled.span`
  height: 15px;
  width: 15px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  margin: 1px;
  border: 1px solid black;
  position: relative;
  top: 2.5px;
  left: 3px;
`;
const OrderItemBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 13px;
  border-top: 1px solid #dbdbdb;
  @media (max-width: 400px) {
    font-size: 13px;
  }
`;
const OrderItemOptions = styled.span`
  cursor: pointer;
  user-select: none;
  padding: 5px;
  width: 33%;
  text-align: center;
  transition: 0.3s;
  &:hover {
    background: #dbdbdb;
  }
  @media (max-width: 1000px) {
    padding: 3px;
  }
  @media (max-width: 400px) {
    padding: 3px;
  }
`;
const OrderBoxSettings = styled.div`
  padding: 5px 5px;
  padding-bottom: 0;
  margin-bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: 360px) {
    padding: 0px;
    padding-top: 8px;
  }
`;
const OrderBoxSettingsItem = styled.p`
  padding: 0;
  margin: 0;
  margin-right: 10px;
  font-size: 14px;
  color: var(--text-muted);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 360px) {
    margin-right: 5px;
  }
  @media (max-width: 335px) {
    font-size: 13px;
  }
`;
const ShowOrderButton = styled.button`
  border: none;
  background: none;
  font-weight: bold;
  font-size: 15px;
  margin: 0;
  padding: 0;
  padding-left: 8px;
  &:focus {
    outline: 0;
  }
  @media (max-width: 460px) {
    font-size: 13px;
    margin-right: -10px;
  }
`;
const Row = styled.div`
  padding: 3px 8px;
  max-height: 0;
  overflow: hidden;
  -webkit-transition: max-height 0.8s;
  -moz-transition: max-height 0.8s;
  transition: max-height 0.8s;
  transition-delay: 0;
`;
const WebsiteLink = styled.a`
  text-decoration: none;
`;
const RateSellerStars = styled.div`
  display: none;
  position: absolute;
  bottom: 29px;
  left: 0px;
  background: white;
  border: 1px solid #dbdbdb;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  padding: 10px;
  min-width: 100%;
  width: 140px;
  font-size: 12px;
  cursor: auto;

  @media (max-width: 793px) {
    bottom: 45px;
  }
  @media (max-width: 766px) {
    bottom: 30px;
  }
`;
const RateSellerSection = styled.div`
  position: relative;
  padding: 5px;
  &:hover ${RateSellerStars} {
    display: block;
  }
`;
const RateSellerText = styled.span``;
const RateSellersStarsTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid #dbdbdb;
`;

const ProfilePageOrderSection = ({ setIsEmpty, isEmpty }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.Auth);
  const { orders, loading: isLoading } = useSelector((state) => state.Order);
  const { ratedSellers, loading, error } = useSelector(
    (state) => state.RateSeller
  );
  const [isDisplayingRateError, setIsDisplayingRateError] = useState(false);
  const [visibleOrder, setVisibleOrder] = useState("");
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isSellerDetailsModalOpen, setIsSellerDetailsModalOpen] =
    useState(false);
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [sellerDetail, setSellerDetail] = useState("");
  const [orderDetailsGroupId, setOrderDetailsGroupId] = useState("");

  const history = useHistory();

  useEffect(() => {
    if (Object.keys(orders).length < 1) setIsEmpty(true);
    if (Object.keys(orders).length > 0) setIsEmpty(false);
  }, [orders]);

  useEffect(() => {
    setIsDisplayingRateError(true);
    setTimeout(() => setIsDisplayingRateError(false), 1500);
  }, [error]);

  const productReviewsLink = (productId) => {
    history.push(`/product/${productId}/#reviews`);
  };
  const openOrderDetailsModal = (groupId) => {
    setOrderDetailsGroupId(groupId);
    setIsOrderDetailsModalOpen(true);
  };
  const openSellerDetailsModal = (seller) => {
    setSellerDetail(seller);
    setIsSellerDetailsModalOpen(true);
  };
  const RateSeller = (val, orderItem) => {
    dispatch(
      rateSeller({
        rating: val,
        seller: orderItem.order.seller._id,
        user: user._id,
      })
    );
  };
  const isSellerRated = (orderItem) => {
    const ratedItem = ratedSellers.filter(
      (item) => item.seller === orderItem.order.seller._id
    );

    if (ratedItem.length > 0) {
      return ratedItem[0].rating;
    } else {
      return 0;
    }
  };
  const cancelOrder = (groupId) => {
    setOrderDetailsGroupId(groupId);
    setIsCancelOrderModalOpen(true);
  };
  const showCancelButton = (key) => {
    return orders[key][0].order.status === "delivered" ||
      orders[key][0].order.status === "cancelRequest" ||
      orders[key][0].order.status === "cancelled"
      ? false
      : true;
  };

  if (isEmpty) {
    return (
      <div>
        {isLoading ? (
          <img
            src={LoadingIcon}
            alt="loading gif"
            height="70"
            width="70"
            style={{ display: "block", margin: "auto" }}
          />
        ) : (
          <h4>No Orders Added</h4>
        )}
      </div>
    );
  }

  return (
    <div>
      {isOrderDetailsModalOpen && (
        <OrderDetailsModal
          setIsOrderDetailsModalOpen={setIsOrderDetailsModalOpen}
          orderGroup={orders[orderDetailsGroupId]}
        />
      )}
      {isSellerDetailsModalOpen && (
        <SellerDetailsModal
          Seller={sellerDetail}
          closeModal={setIsSellerDetailsModalOpen}
        />
      )}
      {isCancelOrderModalOpen && (
        <Modal
          isRedux={true}
          action={orderCancelRequest}
          message="You will get refunded, if seller confirms your cancel request. This action is irreversible. Do you want to cancel your order?"
          setIsModalOpen={setIsCancelOrderModalOpen}
          header="Cancel Order"
          btnText="Cancel Order"
          param={orderDetailsGroupId}
        />
      )}
      <div
        className="checkout-address-section-top w-100"
        style={{ position: "absolute", top: "0", left: "0" }}
      >
        <BoxHeaderText>{Object.keys(orders).length} Orders</BoxHeaderText>
      </div>
      {isLoading && (
        <img
          src={LoadingIcon}
          alt="loading gif"
          height="45"
          width="45"
          style={{ display: "block", marginBottom: "-30px", marginTop: "20px" }}
        />
      )}
      {Object.keys(orders).map((order, index) => {
        return (
          <div key={index}>
            <OrderBox
              className="checkout-address-section"
              style={index === 0 ? { marginTop: "35px" } : {}}
            >
              <OrderBoxTop className="checkout-address-section-top">
                <OrderHighlight>
                  <span style={{ fontWeight: "bold" }}>
                    {orders[order].length}
                  </span>{" "}
                  products, on{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {moment(orders[order][0].order.createdAt).format("ll")}
                  </span>
                  , paid:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {priceConverter(orders[order][0].order.totalAmount)}
                  </span>
                </OrderHighlight>
                {visibleOrder !== order ? (
                  <ShowOrderButton onClick={() => setVisibleOrder(order)}>
                    Show <MdKeyboardArrowDown style={{ fontSize: "20px" }} />
                  </ShowOrderButton>
                ) : (
                  <ShowOrderButton onClick={() => setVisibleOrder("")}>
                    Hide <MdKeyboardArrowUp style={{ fontSize: "20px" }} />
                  </ShowOrderButton>
                )}
              </OrderBoxTop>
              <OrderBoxSettings>
                <OrderBoxSettingsItem
                  onClick={() => openOrderDetailsModal(order)}
                >
                  <b>Order Details</b>
                </OrderBoxSettingsItem>
                <WebsiteLink
                  href={orders[order][0].Payment.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OrderBoxSettingsItem>View Receipt</OrderBoxSettingsItem>
                </WebsiteLink>
                {showCancelButton(order) && (
                  <OrderBoxSettingsItem onClick={() => cancelOrder(order)}>
                    Cancel Order
                  </OrderBoxSettingsItem>
                )}
              </OrderBoxSettings>
              <Row
                className="row"
                style={{
                  maxHeight: visibleOrder === order ? "1000px" : "0",
                }}
              >
                {orders[order][0].order.note && (
                  <span
                    style={{ fontSize: "14px", color: "var(--text-muted)" }}
                  >
                    <span style={{ fontSize: "20px", color: "black" }}>
                      <b>
                        <MdInfoOutline />
                      </b>
                    </span>{" "}
                    {orders[order][0].order.note}
                  </span>
                )}
                {orders[order].map((orderItem, idx) => {
                  return (
                    <div className="col-md-6" key={idx}>
                      <OrderItem>
                        <Link
                          to={`/product/${orderItem.order.Product.product._id}`}
                        >
                          <OrderItemImage
                            src={orderItem.order.Product.product.images[0].url}
                            alt="product"
                          />
                        </Link>
                        <OrderItemTitle>
                          <span style={{ fontWeight: "bold", color: "#333" }}>
                            {orderItem.order.seller.companyName}
                          </span>{" "}
                          {orderItem.order.Product.product.title.length > 55
                            ? `${orderItem.order.Product.product.title.substring(
                                0,
                                55
                              )}...`
                            : orderItem.order.Product.product.title}
                        </OrderItemTitle>
                        <OrderItemPrice>
                          {priceConverter(
                            orderItem.order.Product.product.price
                          )}{" "}
                          -{" "}
                          <OrderItemColorAndQty>
                            qty: {orderItem.order.Product.quantity}
                          </OrderItemColorAndQty>
                          <ColorPreview
                            style={{
                              background: "#" + orderItem.order.Product.color,
                            }}
                          />
                        </OrderItemPrice>
                        <OrderItemPrice
                          style={{
                            fontSize: "14px",
                            color: "var(--text-muted)",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "normal",
                              textDecoration: "underline",
                            }}
                          >
                            {orderItem.order.status === "waitingConfirmation" &&
                              "Waiting confirmation by seller"}
                            {orderItem.order.status === "cancelRequest" &&
                              "Waiting for seller to confirm cancellation"}
                            {orderItem.order.status === "confirmed" &&
                              "Seller confirmed your order"}
                            {orderItem.order.status === "cancelled" &&
                              "Order is cancelled"}
                          </span>
                        </OrderItemPrice>
                        <OrderItemBottom>
                          <OrderItemOptions
                            style={{ borderRight: "1px solid #dbdbdb" }}
                            onClick={() =>
                              openSellerDetailsModal(orderItem.order.seller)
                            }
                          >
                            Seller Details
                          </OrderItemOptions>
                          <OrderItemOptions
                            style={{
                              borderRight: "1px solid #dbdbdb",
                              padding: "0",
                            }}
                          >
                            <RateSellerSection>
                              <RateSellerStars>
                                <RateSellersStarsTop>
                                  Rate Seller
                                </RateSellersStarsTop>
                                {loading && (
                                  <img
                                    src={LoadingIcon}
                                    alt="loading icon spinning"
                                    height="40px"
                                    width="40px"
                                    style={{ marginTop: "10px" }}
                                  />
                                )}
                                {error && isDisplayingRateError && (
                                  <span className="text-danger">{error}</span>
                                )}
                                {!loading && !isDisplayingRateError && (
                                  <div
                                    style={{
                                      marginTop: "10px",
                                      display: "flex",
                                      alignItems: "center",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <ReactStars
                                      count={5}
                                      a11y={false}
                                      value={isSellerRated(orderItem)}
                                      onChange={(val) =>
                                        RateSeller(val, orderItem)
                                      }
                                      size={24}
                                      activeColor="#ffd700"
                                      className="react-stars-seller-rating"
                                    />
                                    {ratedSellers.find(
                                      (item) =>
                                        item.seller ===
                                        orderItem.order.seller._id
                                    ) && (
                                      <span
                                        style={{
                                          display: "inline-block",
                                          cursor: "pointer",
                                          textDecoration: "underline",
                                          color: "var(--text-muted)",
                                        }}
                                        onClick={() =>
                                          dispatch(
                                            deleteSellerRating(
                                              ratedSellers.filter(
                                                (item) =>
                                                  item.seller ===
                                                  orderItem.order.seller._id
                                              )[0]._id,
                                              orderItem.order.seller._id
                                            )
                                          )
                                        }
                                      >
                                        Delete Rating
                                      </span>
                                    )}
                                  </div>
                                )}
                              </RateSellerStars>
                              <RateSellerText>Rate Seller</RateSellerText>
                            </RateSellerSection>
                          </OrderItemOptions>
                          <OrderItemOptions
                            onClick={() =>
                              productReviewsLink(
                                orderItem.order.Product.product._id
                              )
                            }
                          >
                            Rate Product
                          </OrderItemOptions>
                        </OrderItemBottom>
                      </OrderItem>
                    </div>
                  );
                })}
              </Row>
            </OrderBox>
          </div>
        );
      })}
    </div>
  );
};

export default ProfilePageOrderSection;
