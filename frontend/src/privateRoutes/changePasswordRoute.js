import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notSellerRoute } from "../redux/actions/sellerActions";

const ChangePasswordRoute = ({
  component: Component,
  isPasswordReset,
  confirmationCode,
  confirmationSuccess,
  emailOrUsername,
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
};

export default ChangePasswordRoute;
