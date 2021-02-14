import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, auth, isSeller, ...rest }) => (
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

export default PrivateRoute;
