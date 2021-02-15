import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sellerRoute } from "../redux/actions/sellerActions";

const SellerRoute = ({
  component: Component,
  isSellerAuthenticated,
  ...rest
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(sellerRoute());
  }, []);
  return (
    <Route
      {...rest}
      render={(props) =>
        isSellerAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/seller/login" />
        )
      }
    />
  );
};

export default SellerRoute;
