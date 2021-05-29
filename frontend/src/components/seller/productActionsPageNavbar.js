import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const ListItem = styled.li`
  width: 100%;
  cursor: pointer;
  padding: 5px;
  font-size: 18px;
  white-space: nowrap;
  word-wrap: break-word;
  transition: 0.3s;
  user-select: none;

  &:hover {
    background: #efefef;
    box-shadow: inset 0px -2px 0px var(--text-muted);
  }

  @media (max-width: 600px) {
    font-size: 16px;
    padding-top: 5px;
  }

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;
const UnorderedList = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  text-align: center;
  margin-left: -16px;

  @media (max-width: 1200px) {
    margin-left: -25px;
  }
`;
const Navbar = styled.div``;

const ProductActionsPageNavbar = ({
  isProductListPage = false,
  isProductActionsPage = false,
  isAddProductPage = false,
  isAllOrdersPage = false,
  isCancelRequestOrdersPage = false,
  isCancelledOrdersPage = false,
  isOrders = false,
}) => {
  const [isProductList, setIsProductList] = useState(isProductListPage);
  const [isProductActions, setIsProductActions] =
    useState(isProductActionsPage);
  const [isAddProduct, setIsAddProduct] = useState(isAddProductPage);
  const [isAllOrders, setIsAllOrdersPage] = useState(isAllOrdersPage);
  const [isCancelRequestOrders, setIsCancelRequestOrders] = useState(
    isCancelRequestOrdersPage
  );
  const [isCancelledOrders, setIsCancelledOrders] = useState(
    isCancelledOrdersPage
  );

  const history = useHistory();

  if (!isOrders) {
    return (
      <Navbar>
        <UnorderedList>
          <ListItem
            className={
              isProductList
                ? "product-nav-item product-nav-item-active"
                : "product-nav-item"
            }
            onClick={() => history.push("/seller/products/all")}
          >
            Product List
          </ListItem>
          <ListItem
            className={
              isProductActions
                ? "product-nav-item product-nav-item-active"
                : "product-nav-item"
            }
            onClick={() => history.push("/seller/products/actions")}
          >
            Product Actions
          </ListItem>
          <ListItem
            className={
              isAddProductPage
                ? "product-nav-item product-nav-item-active"
                : "product-nav-item"
            }
            onClick={() => history.push("/seller/products/add")}
          >
            Add Product
          </ListItem>
        </UnorderedList>
      </Navbar>
    );
  } else {
    return (
      <Navbar>
        <UnorderedList>
          <ListItem
            className={
              isAllOrders
                ? "product-nav-item product-nav-item-active"
                : "product-nav-item"
            }
            onClick={() => history.push("/seller/orders/list")}
          >
            Orders
          </ListItem>
          <ListItem
            className={
              isCancelRequestOrdersPage
                ? "product-nav-item product-nav-item-active"
                : "product-nav-item"
            }
            onClick={() => history.push("/seller/orders/cancel_request")}
          >
            Cancel Requests
          </ListItem>
          <ListItem
            className={
              isCancelledOrders
                ? "product-nav-item product-nav-item-active"
                : "product-nav-item"
            }
            onClick={() => history.push("/seller/orders/cancelled")}
          >
            Cancelled Orders
          </ListItem>
        </UnorderedList>
      </Navbar>
    );
  }
};

export default ProductActionsPageNavbar;
