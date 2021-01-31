import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <Link to="/">
        <button className="default-btn">Go Back To Home</button>
      </Link>
    </div>
  );
};

export default NotFound;
