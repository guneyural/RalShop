import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import "./styles/navbar.css";
import "./styles/auth.css";
import "./styles/footer.css";
import "./styles/profilePage.css";
import "./styles/modalStyle.css";
import "./styles/sellerRegister.css";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
