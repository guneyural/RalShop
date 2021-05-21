import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";

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

const ProductActionsPageNavbar = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const navItems = document.querySelectorAll(".product-nav-item");
    if (location.pathname === "/seller/products/actions") {
      navItems.forEach((item, index) => {
        if (location.pathname === "/seller/products/all" && index === 0) {
          item.classList.add("product-nav-item-active");
        }
        if (location.pathname === "/seller/products/actions" && index === 1) {
          item.classList.add("product-nav-item-active");
        }
        if (location.pathname === "/seller/products/add" && index === 2) {
          item.classList.add("product-nav-item-active");
        }
      });
    }
  }, [location]);

  return (
    <Navbar>
      <UnorderedList>
        <ListItem
          className="product-nav-item"
          onClick={() => history.push("/seller/products/all")}
        >
          Product List
        </ListItem>
        <ListItem
          className="product-nav-item"
          onClick={() => history.push("/seller/products/actions")}
        >
          Product Actions
        </ListItem>
        <ListItem
          className="product-nav-item"
          onClick={() => history.push("/seller/products/add")}
        >
          Add Product
        </ListItem>
      </UnorderedList>
    </Navbar>
  );
};

export default ProductActionsPageNavbar;
