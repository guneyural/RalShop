import React from "react";
import { Route, Redirect } from "react-router-dom";

const PasswordResetRoute = ({
  component: Component,
  isPasswordReset,
  isAuthenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isPasswordReset === false && isAuthenticated === false ? (
        <Redirect to="/auth" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default PasswordResetRoute;
