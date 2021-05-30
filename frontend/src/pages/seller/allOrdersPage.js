import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/seller/productActionsPageNavbar";
import Filters from "../../components/seller/productActionsFilters";
import OrderList from "../../components/seller/orderList";
import { getSellerOrders } from "../../redux/actions/sellerActions";

const AllOrdersPage = () => {
  const { orders } = useSelector((state) => state.Seller);
  const [listProducts, setListProducts] = useState(orders);
  const dispatch = useDispatch();

  useEffect(() => dispatch(getSellerOrders()), []);
  useEffect(
    () =>
      setListProducts([
        ...orders
          .filter((item) => item.order.status !== "cancelRequest")
          .filter((item) => item.order.status !== "cancelled"),
      ]),
    [orders]
  );

  return (
    <>
      <Navbar isOrders={true} isAllOrdersPage={true} />
      <Filters
        setListProducts={setListProducts}
        listProducts={listProducts}
        DefaultProducts={orders
          .filter((item) => item.order.status !== "cancelRequest")
          .filter((item) => item.order.status !== "cancelled")}
        isOrders={true}
      />
      <OrderList Orders={listProducts} />
    </>
  );
};

export default AllOrdersPage;
