import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notSellerRoute } from "../redux/actions/sellerActions";

const PrivateRoute = ({ component: Component, auth, isSeller, ...rest }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(notSellerRoute());
  }, []);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true ? (
          <Component {...props} />
        ) : isSeller ? (
          <Redirect to="/seller/login" />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

export default PrivateRoute;
