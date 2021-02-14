import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateLogin = ({ component: Component, auth, isSeller, ...rest }) => (
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

export default PrivateLogin;
