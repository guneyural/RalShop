import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LoadingIcon from "../../assets/loading.gif";
import { useSelector } from "react-redux";
import { BsClipboard } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { priceConverter } from "../../utils/helpers";
import ConfirmationModal from "../messageBox";
import OrderDetail from "../orderDetailsModal";

const Container = styled.div`
  margin-left: 15px;
  border: 1px solid #dbdbdb;
  background: rgb(253, 253, 253);
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  margin-top: 20px;
  min-height: 280px;

  @media (max-width: 1200px) {
    margin-left: 8px;
  }
`;
const Caption = styled.p`
  margin-left: 15px;
  margin-top: 15px;
  margin-bottom: -5px;

  @media (max-width: 1200px) {
    margin-left: 8px;
  }
`;
const CopyButton = styled.button`
  margin: 0;
  padding: 0;

  &:focus {
    outline: 0;
  }
`;
const ColorPreview = styled.span`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  margin: 1px;
  border: 1px solid black;
  position: relative;
`;
const Select = styled.select`
  padding: 4px 5px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 100%;
`;
const DetailsButton = styled.button`
  backgrond: transparent;
  border: transparent;
  font-size: 13px;

  &:focus {
    outline: 0;
  }
`;

const OrderList = ({ Orders, onlyShowCancelRequests = false }) => {
  const { loading } = useSelector((state) => state.Seller);
  const [selectedOrder, setSelectedOrder] = useState();
  const [newStatus, setNewStatus] = useState("");
  const [isConfirmationModalOpen, setIsConfirmaitonModalOpen] = useState(false);
  const [statusList, setStatusList] = useState([
    { value: "waitingConfirmation", text: "Waiting For Seller Confirmation" },
    { value: "confirmed", text: "Order Confirmed By Seller" },
    { value: "cancelRequest", text: "Customer Requested To Cancel The Order" },
    { value: "cancelled", text: "Order Is Cancelled" },
    { value: "packing", text: "Order Is Packing" },
    { value: "shipped", text: "Order Is Shipped" },
    { value: "delivered", text: "Order Is Delivered" },
  ]);
  const history = useHistory();
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrderGroup, setSelectedOrderGroup] = useState([]);

  function Clipboard_CopyTo(value) {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }

  function changeStatus(e, itemId) {
    setNewStatus(e.target.value);
    setSelectedOrder(itemId);
    setIsConfirmaitonModalOpen(true);
  }

  function getOrderDetails(groupId) {
    setSelectedOrderGroup([
      ...Orders.filter((item) => item.groupId === groupId),
    ]);
    setIsOrderDetailsOpen(true);
  }

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={LoadingIcon}
          alt="loading icon spinning"
          height="100"
          width="100"
        />
      </Container>
    );
  }

  if (Orders.length < 1) {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="lead">
          You Don't Have Any Orders
        </p>
      </Container>
    );
  }

  return (
    <>
      {isOrderDetailsOpen && (
        <OrderDetail
          setIsOrderDetailsModalOpen={setIsOrderDetailsOpen}
          orderGroup={selectedOrderGroup}
        />
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isRedux={true}
          action={"buraya bir aksiyon koy"}
          message={
            "Any status change of order will be sent as mail to the customer. Do you want to change status?"
          }
          setIsModalOpen={setIsConfirmaitonModalOpen}
          header={"Change Status"}
          btnText={"Change Status"}
          param={"gerekirse parametre koy"}
          secondParam={"gerekirse ikinci parametreyi de koy"}
        />
      )}
      <Caption>List of {Orders.length} orders</Caption>
      <Container>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" style={{ minWidth: "30px" }}>
                  ID
                </th>
                <th scope="col">Name</th>
                <th scope="col">Image</th>
                <th scope="col">Price</th>
                <th scope="col">Brand</th>
                <th scope="col">Color</th>
                <th scope="col">Category</th>
                <th scope="col">Stock</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ fontSize: "12px" }}>
                  Order Details
                </th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {Orders.map((item, index) => {
                return (
                  <tr key={index}>
                    <td
                      valign="middle"
                      style={{ minWidth: "5px", fontSize: "12px" }}
                    >
                      <CopyButton
                        onClick={() => Clipboard_CopyTo(item.order._id)}
                      >
                        <BsClipboard />
                        <br />
                        Copy ID
                      </CopyButton>
                    </td>
                    <td valign="middle" style={{ fontSize: "13px" }}>
                      <b
                        className="product-actions-product-name"
                        onClick={() =>
                          history.push(
                            `/product/${item.order.Product.product._id}`
                          )
                        }
                      >
                        {item.order.Product.product.title}
                      </b>
                    </td>
                    <td>
                      <img
                        src={item.order.Product.product.images[0].url}
                        alt="product"
                        height="80"
                        width="80"
                        style={{
                          objectFit: "contain",
                          display: "block",
                          margin: "auto",
                        }}
                      />
                    </td>
                    <td valign="middle">
                      {priceConverter(item.order.Product.product.price)}
                    </td>
                    <td valign="middle">{item.order.Product.product.brand}</td>
                    <td valign="middle">
                      <ColorPreview
                        style={{ background: "#" + item.order.Product.color }}
                      />
                    </td>
                    <td valign="middle">
                      {item.order.Product.product.subCategory}
                    </td>
                    <td valign="middle">{item.order.Product.product.stock}</td>
                    <td valign="middle">
                      <Select
                        value={item.order.status}
                        onChange={(e) => changeStatus(e)}
                      >
                        {onlyShowCancelRequests ? (
                          <>
                            <option value="cancelRequest">
                              Customer Requested To Cancel The Order
                            </option>
                            <option value="cancelled">
                              Order Is Cancelled
                            </option>
                          </>
                        ) : (
                          statusList.map((status, index) => {
                            return (
                              status.value !== "cancelRequest" && (
                                <option key={index} value={status.value}>
                                  {status.text}
                                </option>
                              )
                            );
                          })
                        )}
                      </Select>
                    </td>
                    <td valign="middle">
                      <DetailsButton
                        onClick={() => getOrderDetails(item.groupId)}
                      >
                        <CgDetailsMore /> Details
                      </DetailsButton>
                    </td>
                    <td valign="middle">
                      {moment(item.order.createdAt).format("ll")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
};

export default OrderList;
