import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSellerOrders } from "../../redux/actions/sellerActions";
import Navbar from "../../components/seller/productActionsPageNavbar";
import OrderList from "../../components/seller/orderList";
import Filters from "../../components/seller/productActionsFilters";

const CancelledOrdersPage = () => {
  const { orders } = useSelector((state) => state.Seller);
  const [listProducts, setListProducts] = useState(orders);
  const dispatch = useDispatch();

  useEffect(() => dispatch(getSellerOrders()), []);
  useEffect(
    () =>
      setListProducts(
        orders.filter((item) => item.order.status === "cancelled")
      ),
    [orders]
  );

  return (
    <>
      <Navbar isOrders={true} isCancelledOrdersPage={true} />
      <Filters
        setListProducts={setListProducts}
        listProducts={listProducts}
        DefaultProducts={orders.filter(
          (item) => item.order.status === "cancelled"
        )}
        isOrders={true}
      />
      <OrderList Orders={listProducts} onlyCancelled={true} />
    </>
  );
};

export default CancelledOrdersPage;
