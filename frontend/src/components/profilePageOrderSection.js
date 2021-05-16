import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { priceConverter } from "../utils/helpers";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";

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
  width: 80%;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 3px 8px;
  height: 250px;
  position: relative;
  @media (max-width: 375px) {
    width: 97%;
  }
  @media (max-width: 1000px) {
    height: 270px;
  }
  @media (max-width: 767px) {
    width: 93%;
    height: 230px;
  }
  @media (max-width: 500px) {
    height: 245px;
  }
  @media (max-width: 375px) {
    width: 95%;
    height: 270px;
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
`;
const OrderBoxSettingsItem = styled.p`
  padding: 0;
  margin: 0;
  padding-right: 10px;
  font-size: 14px;
  color: var(--text-muted);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ProfilePageOrderSection = ({ setIsEmpty, isEmpty }) => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.Order);
  const history = useHistory();

  useEffect(() => {
    if (Object.keys(orders).length < 1) setIsEmpty(true);
    if (Object.keys(orders).length > 0) setIsEmpty(false);
  }, [orders]);

  const productReviewsLink = (productId) => {
    history.push(`/product/${productId}/#reviews`);
  };

  if (isEmpty) {
    return <h4>No Orders Added</h4>;
  }

  return (
    <div>
      <div
        className="checkout-address-section-top w-100"
        style={{ position: "absolute", top: "0", left: "0" }}
      >
        <BoxHeaderText>{Object.keys(orders).length} Orders</BoxHeaderText>
      </div>
      {Object.keys(orders).map((order, index) => {
        return (
          <div key={index}>
            <div
              className="checkout-address-section"
              style={index === 0 ? { marginTop: "35px" } : {}}
            >
              <div className="checkout-address-section-top">
                <OrderHighlight>
                  <span style={{ fontWeight: "bold" }}>
                    {orders[order].length}
                  </span>{" "}
                  products, on{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {moment(orders[order][0].createdAt).format("ll")}
                  </span>
                  , paid:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {priceConverter(orders[order][0].totalAmount)}
                  </span>
                </OrderHighlight>
              </div>
              <OrderBoxSettings>
                <OrderBoxSettingsItem>Send Receipt</OrderBoxSettingsItem>
                <OrderBoxSettingsItem>Cancel Order</OrderBoxSettingsItem>
              </OrderBoxSettings>
              <div className="row" style={{ padding: "3px 8px" }}>
                {orders[order].map((orderItem, idx) => {
                  return (
                    <div className="col-md-6" key={idx}>
                      <OrderItem>
                        <Link to={`/product/${orderItem.Product.product._id}`}>
                          <OrderItemImage
                            src={orderItem.Product.product.images[0].url}
                            alt="product"
                          />
                        </Link>
                        <OrderItemTitle>
                          <span style={{ fontWeight: "bold", color: "#333" }}>
                            {orderItem.seller.companyName}
                          </span>{" "}
                          {orderItem.Product.product.title.length > 55
                            ? `${orderItem.Product.product.title.substring(
                                0,
                                55
                              )}...`
                            : orderItem.Product.product.title}
                        </OrderItemTitle>
                        <OrderItemPrice>
                          {priceConverter(orderItem.Product.product.price)} -{" "}
                          <OrderItemColorAndQty>
                            qty: {orderItem.Product.quantity}
                          </OrderItemColorAndQty>
                          <ColorPreview
                            style={{
                              background: "#" + orderItem.Product.color,
                            }}
                          />
                        </OrderItemPrice>
                        <OrderItemBottom>
                          <OrderItemOptions
                            style={{ borderRight: "1px solid #dbdbdb" }}
                          >
                            Seller Details
                          </OrderItemOptions>
                          <OrderItemOptions
                            style={{ borderRight: "1px solid #dbdbdb" }}
                          >
                            Rate Seller
                          </OrderItemOptions>
                          <OrderItemOptions
                            onClick={() =>
                              productReviewsLink(orderItem.Product.product._id)
                            }
                          >
                            Rate Product
                          </OrderItemOptions>
                        </OrderItemBottom>
                      </OrderItem>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfilePageOrderSection;
