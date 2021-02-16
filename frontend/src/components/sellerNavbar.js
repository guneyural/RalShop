import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../assets/logo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

const SellerNavbar = ({ isNavOpen, setIsNavOpen }) => {
  const Seller = useSelector((state) => state.Seller);
  useEffect(() => {
    document.querySelectorAll(".nav-mobile a").forEach((item) => {
      item.addEventListener("click", () => setIsNavOpen(false));
    });
  }, []);
  return (
    <>
      <div className="navbar-section">
        <div className="tiny-nav">
          <div className="container">
            <section className="tiny-nav-left">
              <p className="text-muted">
                {Seller.isAuthenticated
                  ? "Logged in as seller."
                  : "Become a seller and grow your business."}
              </p>
            </section>
            <section className="tiny-nav-right">
              <p>UralShop Marketplace</p>
            </section>
          </div>
        </div>
        <div
          className="top-nav text-light seller-nav"
          style={{ background: "#333333" }}
        >
          <div className="container">
            <section className="navbar-left">
              <Link
                to="/seller/home"
                style={{
                  color: "var(--primary-color)",
                  textDecoration: "none",
                }}
              >
                <img src={Logo} alt="logo" className="nav-logo seller" />
                <span className="logo-text text-light">UralShop</span>
              </Link>
              <section className="seller-nav-links">
                <Link to="/seller/home" className="seller-nav-link firstLink">
                  Home
                </Link>
                <span
                  className="nav-drop"
                  style={{
                    fontWeight: "normal",
                    background: "transparent",
                  }}
                >
                  Product <IoMdArrowDropdown />
                  <div className="drop-content">
                    <Link to="/seller/products/all" className="dropdown-link">
                      All Products
                    </Link>
                    <Link to="/seller/products/sales" className="dropdown-link">
                      On Sale
                    </Link>
                    <Link
                      to="/seller/products/outofstock"
                      className="dropdown-link"
                    >
                      Out Of Stock
                    </Link>
                    <Link
                      to="/seller/products/saleslist"
                      className="dropdown-link"
                    >
                      Sales List
                    </Link>
                  </div>
                </span>
                <span
                  className="nav-drop"
                  style={{
                    fontWeight: "normal",
                    background: "transparent",
                  }}
                >
                  Order <IoMdArrowDropdown />{" "}
                  <div className="drop-content">
                    <Link to="/seller/orders/cargo" className="dropdown-link">
                      Cargo
                    </Link>

                    <Link
                      to="/seller/orders/cancelled"
                      className="dropdown-link"
                    >
                      Cancelled orders
                    </Link>
                  </div>
                </span>
                <Link to="/seller/notifications" className="seller-nav-link">
                  Dashboard
                </Link>
                <Link to="/seller/notifications" className="seller-nav-link">
                  Add Product
                </Link>
              </section>
            </section>
            <section className="navbar-middle seller">
              <Link to="/seller/messages">Messages</Link>
              <Link to="/seller/notifications">Notifications</Link>
              <Link to="/seller/profile">Profile</Link>
            </section>
            <button
              className="burger-icon-seller text-light"
              aria-label="menu-button"
              onClick={() => setIsNavOpen(true)}
            >
              <GiHamburgerMenu />
            </button>
          </div>
        </div>
      </div>
      <div className="nav-mobile">
        <section className="nav-mobile-top">
          <button
            className="burger-icon"
            aria-label="menu-button"
            onClick={() => setIsNavOpen(false)}
          >
            <GiHamburgerMenu />
          </button>
          <section style={{ position: "relative", top: "10px" }}>
            <span className="mobile-logo-text">UralShop</span>
            <p className="text-muted" style={{ marginTop: "-10px" }}>
              Marketplace
            </p>
          </section>
        </section>
        <section className="mobile-nav-middle">
          <section className="mobile-nav-links">
            <Link to="/seller/home" className="seller-mobile-link">
              Home
            </Link>
            <span
              className="nav-drop seller-mobile-link"
              style={{
                fontWeight: "normal",
                background: "transparent",
              }}
            >
              Product <IoMdArrowDropdown />
              <div className="drop-content">
                <Link to="/seller/products/all" className="dropdown-link">
                  All Products
                </Link>
                <Link to="/seller/products/sales" className="dropdown-link">
                  On Sale
                </Link>
                <Link
                  to="/seller/products/outofstock"
                  className="dropdown-link"
                >
                  Out Of Stock
                </Link>
                <Link to="/seller/products/saleslist" className="dropdown-link">
                  Sales List
                </Link>
              </div>
            </span>
            <span
              className="nav-drop seller-mobile-link"
              style={{
                fontWeight: "normal",
                background: "transparent",
              }}
            >
              Order <IoMdArrowDropdown />{" "}
              <div className="drop-content">
                <Link to="/seller/orders/cargo" className="dropdown-link">
                  Cargo
                </Link>

                <Link to="/seller/orders/cancelled" className="dropdown-link">
                  Cancelled orders
                </Link>
              </div>
            </span>
            <Link to="/seller/notifications" className="seller-mobile-link">
              Dashboard
            </Link>
            <Link to="/seller/notifications" className="seller-mobile-link">
              Add Product
            </Link>
            <Link to="/seller/messages" className="seller-mobile-link">
              Messages
            </Link>
            <Link to="/seller/notifications" className="seller-mobile-link">
              Notifications
            </Link>
            <Link to="/seller/profile" className="seller-mobile-link">
              Profile
            </Link>
          </section>
        </section>
        <section className="mobile-nav-bottom">
          <Link
            to="/"
            style={{
              color: "var(--primary-color)",
              textDecoration: "none",
            }}
          >
            <img src={Logo} alt="logo" className="mobile-logo" />
            <span className="mobile-logo-text">UralShop</span>
          </Link>
        </section>
      </div>
    </>
  );
};

export default SellerNavbar;
