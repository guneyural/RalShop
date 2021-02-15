import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notSellerRoute } from "../redux/actions/sellerActions";

const PasswordResetRoute = ({
  component: Component,
  isPasswordReset,
  isAuthenticated,
  ...rest
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(notSellerRoute());
  }, []);
  return (
    <Route
      {...rest}
      render={(props) =>
        isPasswordReset === false || isAuthenticated === true ? (
          <Redirect to="/auth" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PasswordResetRoute;
