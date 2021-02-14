import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./privateRoutes/privateRoute";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import WishlistPage from "./pages/wishlistPage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/actions/authActions";
import { getCurrentSeller } from "./redux/actions/sellerActions";
import PrivateLogin from "./privateRoutes/privateLogin";
import ProfilePage from "./pages/ProfilePage";
import ProfileSettingsPage from "./pages/ProfileSettings";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PasswordCodeConfirmationPage from "./pages/ForgotPasswordCodePage";
import PasswordResetRoute from "./privateRoutes/passwordResetRoutes";
import ChangePasswordRoute from "./privateRoutes/changePasswordRoute";
import ChangePasswordPage from "./pages/changePasswordPage";
import SellerRegisterPage from "./pages/seller/registerPage";
import SellerLoginPage from "./pages/seller/loginPage";
import SellerHome from "./pages/seller/sellerHomePage";
import mapboxgl from "mapbox-gl";

require("dotenv").config();

const App = () => {
  const dispatch = useDispatch();
  const User = useSelector((state) => state.Auth);
  const Seller = useSelector((state) => state.Seller);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch, User.isAuthenticated]);
  useEffect(() => {
    dispatch(getCurrentSeller());
  }, [dispatch, Seller.isAuthenticated]);
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  return (
    <Router>
      <Navbar />
      <div className="container main-container" style={{ paddingTop: "120px" }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateLogin
            path="/auth"
            exact
            component={AuthPage}
            auth={User.isAuthenticated}
          />
          <PrivateLogin
            path="/account/forgot_password"
            exact
            component={ForgotPasswordPage}
            auth={User.isAuthenticated}
          />
          <PrivateRoute
            path="/seller/home"
            exact
            component={SellerHome}
            isSeller={true}
            auth={Seller.isAuthenticated}
          />
          <PrivateRoute
            path="/wishlist"
            exact
            component={WishlistPage}
            auth={User.isAuthenticated}
          />
          <PrivateLogin
            path="/seller/register"
            exact
            isSeller={true}
            auth={Seller.isAuthenticated}
            component={SellerRegisterPage}
          />
          <PrivateLogin
            path="/seller/login"
            exact
            auth={Seller.isAuthenticated}
            isSeller={true}
            component={SellerLoginPage}
          />
          <Route path="/user/:username" exact component={ProfilePage} />
          <PrivateRoute
            path="/account/settings"
            exact
            component={ProfileSettingsPage}
            auth={User.isAuthenticated}
          />
          <PasswordResetRoute
            path="/account/forgot_password/confirmation"
            component={PasswordCodeConfirmationPage}
            auth={User.isAuthenticated}
            isPasswordReset={User.forgotPassword.isPasswordReset}
            exact
          />
          <ChangePasswordRoute
            isPasswordReset={User.forgotPassword.isPasswordReset}
            confirmationCode={User.forgotPassword.confirmationCode}
            confirmationSuccess={User.forgotPassword.confirmationCodeSuccess}
            isAuthenticated={User.isAuthenticated}
            emailOrUsername={User.forgotPassword.emailOrUsername}
            path="/account/forgot_password/change_password"
            component={ChangePasswordPage}
            exact
          />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
