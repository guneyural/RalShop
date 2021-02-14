import React from "react";
import { Route, Redirect } from "react-router-dom";

const SellerChangePasswordPage = ({
  component: Component,
  isResetPasswordSuccess,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isResetPasswordSuccess === true || isResetPasswordSuccess === null ? (
        <Component {...props} />
      ) : (
        <Redirect to="/seller/login" />
      )
    }
  />
);

export default SellerChangePasswordPage;
