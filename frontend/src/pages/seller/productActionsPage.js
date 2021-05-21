import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { getAllSellerProducts } from "../../redux/actions/sellerActions";
import Navbar from "../../components/seller/productActionsPageNavbar";
import Filters from "../../components/seller/productActionsFilters";
import ProductList from "../../components/seller/productActionsProductList";

const ProductActionsPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.Seller);

  useEffect(() => {
    dispatch(getAllSellerProducts());
  }, []);

  return (
    <div>
      <Navbar />
      <Filters />
      <ProductList Products={products} />
    </div>
  );
};

export default ProductActionsPage;
