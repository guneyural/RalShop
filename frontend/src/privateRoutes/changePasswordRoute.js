import React from "react";
import { Route, Redirect } from "react-router-dom";

const ChangePasswordRoute = ({
  component: Component,
  isPasswordReset,
  confirmationCode,
  confirmationSuccess,
  isAuthenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isPasswordReset ||
      !confirmationSuccess ||
      isAuthenticated ||
      confirmationCode === null ? (
        <Redirect to="/auth" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default ChangePasswordRoute;
