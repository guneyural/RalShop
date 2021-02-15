import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notSellerRoute } from "../redux/actions/sellerActions";

const PrivateLogin = ({ component: Component, auth, isSeller, ...rest }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(notSellerRoute());
  }, []);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true ? (
          isSeller ? (
            <Redirect to="/seller/home" />
          ) : (
            <Redirect to="/" />
          )
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateLogin;
