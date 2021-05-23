import React, { useState } from "react";
import styled from "styled-components";
import LoadingIcon from "../../assets/loading.gif";
import { useSelector } from "react-redux";
import { priceConverter } from "../../utils/helpers";
import { BsStarFill, BsStar, BsStarHalf, BsClipboard } from "react-icons/bs";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { deleteProduct } from "../../redux/actions/sellerActions";
import DeleteModal from "../../components/messageBox";
import UpdateProductModal from "../../components/seller/updateProductModal";
import moment from "moment";

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

const ProductActionsProductList = ({ Products, actionsAvailable = true }) => {
  const { loading } = useSelector((state) => state.Seller);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const history = useHistory();

  const removeProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  const updateProduct = (product) => {
    setSelectedProduct(product);
    setIsUpdateProductModalOpen(true);
  };
  function Clipboard_CopyTo(value) {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
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
    <>
      <Caption>List of {Products.length} products</Caption>
      <Container>
        {isUpdateProductModalOpen && (
          <UpdateProductModal
            setIsUpdateProductModalOpen={setIsUpdateProductModalOpen}
            Product={selectedProduct}
          />
        )}
        {isDeleteModalOpen && (
          <DeleteModal
            isRedux={true}
            action={deleteProduct}
            message={
              "If this product belongs to an order, this product will be deleted from the order. Then user will be refunded as the price of the deleted product. Do you want to delete this product?"
            }
            setIsModalOpen={setIsDeleteModalOpen}
            header={"Delete Product"}
            btnText={"Delete"}
            param={selectedProduct._id}
          />
        )}
        <div className="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" style={{ minWidth: "30px" }}>
                  ID
                </th>
                <th scope="col">Name</th>
                <th scope="col">Image</th>
                <th scope="col">Price</th>
                <th scope="col">Rating</th>
                <th scope="col">Brand</th>
                <th scope="col">Color</th>
                {!actionsAvailable && <th scope="col">Wishlist Count</th>}
                {!actionsAvailable && <th scope="col">Order Count</th>}
                <th scope="col">Category</th>
                {!actionsAvailable && <th scope="col">Sub Category</th>}
                {!actionsAvailable && <th scope="col">Date</th>}
                <th scope="col">Stock</th>
                {actionsAvailable && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {Products.map((item, index) => {
                return (
                  <tr key={index}>
                    <td
                      valign="middle"
                      style={{ minWidth: "10px", fontSize: "12px" }}
                    >
                      <CopyButton onClick={() => Clipboard_CopyTo(item._id)}>
                        <BsClipboard />
                        <br />
                        Copy ID
                      </CopyButton>
                    </td>
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
                              <BsStarFill
                                style={{ color: "rgb(255, 215, 0)" }}
                              />
                            ) : item.rating > index ? (
                              <BsStarHalf
                                style={{ color: "rgb(255, 215, 0)" }}
                              />
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
                    {!actionsAvailable && (
                      <td valign="middle">{item.wishlistCount}</td>
                    )}
                    {!actionsAvailable && (
                      <td valign="middle">{item.ordersCount}</td>
                    )}
                    <td valign="middle">
                      {actionsAvailable ? item.subCategory : item.category}
                    </td>
                    {!actionsAvailable && (
                      <td valign="middle">{item.subCategory}</td>
                    )}
                    {!actionsAvailable && (
                      <td valign="middle">
                        {moment(item.createdAt).format("ll")}
                      </td>
                    )}
                    <td valign="middle">{item.stock}</td>
                    {actionsAvailable && (
                      <td valign="middle">
                        <button onClick={() => updateProduct(item)}>
                          <FaEdit
                            style={{ fontSize: "12px", marginTop: "-3px" }}
                          />{" "}
                          Edit
                        </button>
                        <br />
                        <button onClick={() => removeProduct(item)}>
                          <FaTrash
                            style={{ fontSize: "10px", marginTop: "-3px" }}
                          />{" "}
                          Delete
                        </button>
                      </td>
                    )}
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

export default ProductActionsProductList;
