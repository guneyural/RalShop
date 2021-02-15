import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notSellerRoute } from "../redux/actions/sellerActions";

const SellerRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(notSellerRoute());
  }, []);
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default SellerRoute;
