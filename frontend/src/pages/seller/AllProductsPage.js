import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllSellerProducts } from "../../redux/actions/sellerActions";
import Navbar from "../../components/seller/productActionsPageNavbar";
import Filters from "../../components/seller/productActionsFilters";
import ProductList from "../../components/seller/productActionsProductList";

const AllProductsPage = () => {
  const { products } = useSelector((state) => state.Seller);
  const [listProducts, setListProducts] = useState(products);
  const dispatch = useDispatch();

  useEffect(() => dispatch(getAllSellerProducts()), []);
  useEffect(() => setListProducts(products), [products]);

  return (
    <>
      <Navbar isProductListPage={true} />
      <Filters
        setListProducts={setListProducts}
        listProducts={listProducts}
        DefaultProducts={products}
      />
      <ProductList Products={listProducts} actionsAvailable={false} />
    </>
  );
};

export default AllProductsPage;
