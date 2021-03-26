import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoute from "./privateRoutes/privateRoute";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import WishlistPage from "./pages/wishlistPage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/actions/authActions";
import {
  getCurrentSeller,
  notSellerRoute,
} from "./redux/actions/sellerActions";
import { getWishlist } from "./redux/actions/wishlistAction";
import { getCart } from "./redux/actions/ShoppingCartActions";
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
import SellerForgotPasswordSendEmailPage from "./pages/seller/ForgotPasswordSendEmailPage";
import SellerChangePasswordPage from "./pages/seller/changePasswordPage";
import ProtectSellerChangePasswordPage from "./privateRoutes/sellerChangePasswordPage";
import mapboxgl from "mapbox-gl";
import SellerRoute from "./privateRoutes/sellerRoutes";
import NormalRoute from "./privateRoutes/NormalRoute";
import SellerProfile from "./pages/seller/SellerProfilePage";
import AddProductPage from "./pages/seller/AddProductPage";
import ProductPage from "./pages/ProductPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";

require("dotenv").config();

const App = () => {
  const dispatch = useDispatch();
  const User = useSelector((state) => state.Auth);
  const Seller = useSelector((state) => state.Seller);

  useEffect(() => {
    dispatch(notSellerRoute());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getUser());
    dispatch(getWishlist());
    dispatch(getCart());
  }, [dispatch, User.isAuthenticated]);
  useEffect(() => {
    dispatch(getCurrentSeller());
  }, [dispatch, Seller.isAuthenticated]);
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  return (
    <Router>
      <Navbar />
      <div
        className="container main-container"
        style={{ paddingTop: Seller.inSellerRoute ? "90px" : "120px" }}
      >
        <Switch>
          <NormalRoute path="/" exact component={Home} />
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
          <PrivateLogin
            path="/seller/forgot_password"
            exact
            component={SellerForgotPasswordSendEmailPage}
            isSeller={true}
            auth={Seller.isAuthenticated}
          />
          <ProtectSellerChangePasswordPage
            path="/seller/forgot_password/reset_password/:token"
            isResetPasswordSuccess={Seller.forgotPassword.resetPasswordError}
            exact
            component={SellerChangePasswordPage}
          />
          <SellerRoute
            path="/seller/profile"
            exact
            component={SellerProfile}
            isSellerAuthenticated={Seller.isAuthenticated}
          />
          <SellerRoute
            path="/seller/products/add"
            exact
            component={AddProductPage}
            isSellerAuthenticated={Seller.isAuthenticated}
          />
          <SellerRoute
            path="/seller/home"
            exact
            component={SellerHome}
            isSellerAuthenticated={Seller.isAuthenticated}
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
          <NormalRoute path="/user/:username" exact component={ProfilePage} />
          <NormalRoute path="/product/:id" exact component={ProductPage} />
          <NormalRoute path="/cart" exact component={ShoppingCartPage} />
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
          <NormalRoute component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
