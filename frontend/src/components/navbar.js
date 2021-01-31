import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import {
  FaSearch,
  FaUserCircle,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

const TinyNavLink = styled.span`
  color: #6c757d;
  &:hover {
    color: #50565c;
    border-bottom: 1px solid #6c757d;
  }
`;

const Navbar = () => {
  return (
    <div className="navbar-section">
      <div className="tiny-nav">
        <div className="container">
          <section className="tiny-nav-left">
            <p className="text-muted">
              Become a seller and grow your business.
            </p>
          </section>
          <section className="tiny-nav-right">
            <Link
              to="/seller/register"
              style={{ textDecoration: "none", marginRight: "10px" }}
            >
              <TinyNavLink>Be A Seller</TinyNavLink>
            </Link>
            <Link to="/seller/login" style={{ textDecoration: "none" }}>
              <TinyNavLink>Login As Seller</TinyNavLink>
            </Link>
          </section>
        </div>
      </div>
      <div className="top-nav">
        <div className="container">
          <section className="navbar-left">
            <Link
              to="/"
              style={{ color: "var(--primary-color)", textDecoration: "none" }}
            >
              <img src={Logo} alt="logo" className="nav-logo" />
              <span className="logo-text">UralShop</span>
            </Link>
          </section>
          <section className="navbar-middle">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="searchQuery"
                placeholder="Search Product, Brand, Category or Seller"
                className="search-bar"
              />
              <button className="navbar-search-icon">
                <FaSearch />
              </button>
            </form>
          </section>
          <section className="navbar-right">
            <Link to="/auth">
              <FaUserCircle /> Login
            </Link>
            <Link to="/wishlist">
              <FaHeart /> Wishlist
            </Link>
            <Link to="/cart">
              <FaShoppingCart /> Shopping Cart
            </Link>
            <button className="burger-icon">
              <GiHamburgerMenu />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
