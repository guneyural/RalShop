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
import PrivateLogin from "./privateRoutes/privateLogin";
import ProfilePage from "./pages/ProfilePage";
import ProfileSettingsPage from "./pages/ProfileSettings";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.Auth);
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch, isAuthenticated]);

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
            auth={isAuthenticated}
          />
          <PrivateRoute
            path="/wishlist"
            exact
            component={WishlistPage}
            auth={isAuthenticated}
          />
          <Route path="/user/:username" exact component={ProfilePage} />
          <PrivateRoute
            path="/account/settings"
            exact
            component={ProfileSettingsPage}
            auth={isAuthenticated}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
