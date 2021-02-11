import React from "react";
import { Route, Redirect } from "react-router-dom";

const ChangePasswordRoute = ({
  component: Component,
  isPasswordReset,
  confirmationCode,
  confirmationSuccess,
  emailOrUsername,
  isAuthenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isPasswordReset ||
      !confirmationSuccess ||
      isAuthenticated ||
      emailOrUsername === null ||
      confirmationCode === null ? (
        <Redirect to="/auth" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default ChangePasswordRoute;
