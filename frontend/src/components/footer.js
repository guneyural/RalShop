import React from "react";
import Logo from "../assets/logo.png";
import styled from "styled-components";
import { Link } from "react-router-dom";

const MySection = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <section style={{ display: "flex" }}>
          <img src={Logo} alt="logo" className="footer-logo" />
          <MySection>
            <span className="footer-logo-text">UralShop</span>
            <span
              style={{
                color: "var(--text-muted)",
                marginTop: "-10px",
                fontSize: "15px",
              }}
            >
              Güney Ural @ 2021
            </span>
          </MySection>
        </section>
        <section className="footer-links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/auth">Login</Link>
            </li>
            <li>
              <Link to="/seller/register">Seller</Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Footer;
