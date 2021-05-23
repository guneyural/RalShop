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
}) => {
  const [isProductList, setIsProductList] = useState(isProductListPage);
  const [isProductActions, setIsProductActions] =
    useState(isProductActionsPage);
  const [isAddProduct, setIsAddProduct] = useState(isAddProductPage);

  const history = useHistory();

  useEffect(() => {
    if (isProductList) {
      setIsProductActions(false);
      setIsAddProduct(false);
    }
  }, [isProductList]);

  useEffect(() => {
    if (isProductActions) {
      setIsProductList(false);
      setIsAddProduct(false);
    }
  }, [isProductActions]);

  useEffect(() => {
    if (isAddProduct) {
      setIsProductList(false);
      setIsAddProduct(false);
    }
  }, [isAddProduct]);

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
};

export default ProductActionsPageNavbar;
