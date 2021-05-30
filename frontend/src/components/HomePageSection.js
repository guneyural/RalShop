import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { BiRightArrowAlt } from "react-icons/bi";

const ShoppingCartBox = styled.div`
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 10px;
  height: 155px;
`;
const LastVisitedBox = styled.div`
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 10px;
  height: 155px;
`;
const Row = styled.div`
  @media (max-width: 500px) {
    display: flex;
    flex-direction: column;
  }
`;
const RowItem = styled.div`
  padding: 4px;

  @media (max-width: 500px) {
    width: 90%;
    margin: auto;
  }

  @media (max-width: 405px) {
    width: 100%;
  }
`;
const BoxTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  transition: 0.3s;
  border-radius: 50%;

  &:hover {
    background: #dedede;
  }

  &:focus {
    outline: 0;
  }
`;
const BoxInner = styled.div`
  margin: -10px;
  margin-top: 2px;
  height: 90px;
  overflow-y: hidden;
  overflow-x: auto;
  padding-left: 10px;
  display: flex;

  &::-webkit-scrollbar {
    height: 2px;
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
const BoxImage = styled.img`
  min-height: 90px;
  min-with: 150px;
  max-width: 150px;
  object-fit: cover;
  border-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-right: 20px;
  border: 1px solid #dbdbdb;
  cursor: pointer;
`;

const HomePageSection = () => {
  const history = useHistory();
  const { products } = useSelector((state) => state.Cart);
  const [lastVisited, setLastVisited] = useState(
    JSON.parse(localStorage.getItem("lastVisited")) || []
  );

  return (
    <Row className="mt-2 row">
      <RowItem className="col-lg-7 col-sm-6 col-6 mb-2">
        <ShoppingCartBox>
          <BoxTop>
            <p className="m-0">
              <b>Shopping Cart</b>
            </p>
            <ArrowButton onClick={() => history.push("/cart")}>
              <BiRightArrowAlt
                style={{ fontSize: "30px", fontWeight: "bolder" }}
              />
            </ArrowButton>
          </BoxTop>
          <BoxInner>
            {products.map((item, index) => {
              return (
                <BoxImage
                  src={item.image}
                  alt="Shopping cart product"
                  key={index}
                  onClick={() => history.push(`/product/${item.product}`)}
                />
              );
            })}
          </BoxInner>
          <p
            style={{
              margin: "0",
              marginTop: "12px",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: "13px",
            }}
            onClick={() => history.push("/checkout")}
          >
            End Shopping
          </p>
        </ShoppingCartBox>
      </RowItem>
      <RowItem className="col-lg-5 col-sm-6 col-6">
        <LastVisitedBox>
          <BoxTop>
            <p className="m-0">
              <b>Last Visited Products</b>
            </p>
          </BoxTop>
          <BoxInner>
            {lastVisited.map((item, index) => {
              return (
                <BoxImage
                  src={item.img}
                  alt="Last visited product"
                  key={index}
                  onClick={() => history.push(`/product/${item._id}`)}
                />
              );
            })}
          </BoxInner>
        </LastVisitedBox>
      </RowItem>
    </Row>
  );
};

export default HomePageSection;
