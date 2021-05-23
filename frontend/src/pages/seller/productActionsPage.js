import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllSellerProducts } from "../../redux/actions/sellerActions";
import Navbar from "../../components/seller/productActionsPageNavbar";
import Filters from "../../components/seller/productActionsFilters";
import ProductList from "../../components/seller/productActionsProductList";

const ProductActionsPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.Seller);
  const [listProducts, setListProducts] = useState(products);

  useEffect(() => setListProducts(products), [products]);

  useEffect(() => {
    dispatch(getAllSellerProducts());
  }, []);

  return (
    <div>
      <Navbar />
      <Filters
        setListProducts={setListProducts}
        listProducts={listProducts}
        DefaultProducts={products}
      />
      <ProductList Products={listProducts} />
    </div>
  );
};

export default ProductActionsPage;
