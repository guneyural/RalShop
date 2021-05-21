import React, { useState } from "react";
import styled from "styled-components";
import LoadingIcon from "../../assets/loading.gif";
import { useSelector } from "react-redux";
import { priceConverter } from "../../utils/helpers";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useHistory } from "react-router-dom";

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
const ContainerTop = styled.div`
  border-bottom: 1.2px solid #dbdbdb;
  padding: 3px 8px;

  @media (max-width: 330px) {
    padding: 1px 8px;
  }
`;
const ContainerInner = styled.div`
  padding: 3px 8px;
  @media (max-width: 330px) {
    padding: 1px 8px;
  }
`;

const ProductActionsProductList = ({ Products }) => {
  const { loading } = useSelector((state) => state.Seller);
  const history = useHistory();

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

  if (Products.length < 1) {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="lead">You Don't Have Any Products. Add Product First.</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Price</th>
              <th scope="col">Rating</th>
              <th scope="col">Brand</th>
              <th scope="col">Color</th>
              <th scope="col">Category</th>
              <th scope="col">Stock</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Products.map((item, index) => {
              return (
                <tr key={index}>
                  <td valign="middle" style={{ fontSize: "13px" }}>
                    <b
                      className="product-actions-product-name"
                      onClick={() => history.push(`/product/${item._id}`)}
                    >
                      {item.title}
                    </b>
                  </td>
                  <td>
                    <img
                      src={item.images[0].url}
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
                  <td valign="middle">{priceConverter(item.price)}</td>
                  <td valign="middle">
                    {Array.from({ length: 5 }, (_, index) => {
                      const number = index + 0.5;
                      return (
                        <span key={index}>
                          {item.rating > number ? (
                            <BsStarFill style={{ color: "rgb(255, 215, 0)" }} />
                          ) : item.rating > index ? (
                            <BsStarHalf style={{ color: "rgb(255, 215, 0)" }} />
                          ) : (
                            <BsStar style={{ color: "rgb(255, 215, 0)" }} />
                          )}
                        </span>
                      );
                    })}
                  </td>
                  <td valign="middle">{item.brand}</td>
                  <td valign="middle">
                    {item.colors[0].split(",").length} Colors
                  </td>
                  <td valign="middle">{item.subCategory}</td>
                  <td valign="middle">{item.stock}</td>
                  <td valign="middle">
                    <button>
                      <FaEdit style={{ fontSize: "12px", marginTop: "-3px" }} />{" "}
                      Edit
                    </button>
                    <br />
                    <button>
                      <FaTrash
                        style={{ fontSize: "10px", marginTop: "-3px" }}
                      />{" "}
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default ProductActionsProductList;
