import React, { useState, useEffect } from "react";
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
import { categories, subCategories } from "../data/category";
import { CgMenuGridR } from "react-icons/cg";
import { useSelector } from "react-redux";
import SellerNavbar from "./sellerNavbar";

const TinyNavLink = styled.span`
  color: #6c757d;
  &:hover {
    color: #50565c;
    border-bottom: 1px solid #6c757d;
  }
`;

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [scroll, setScroll] = useState(window.scrollY);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.Auth);
  const Seller = useSelector((state) => state.Seller);

  useEffect(() => {
    if (!Seller.inSellerRoute) {
      document.querySelectorAll(".nav-mobile a").forEach((item) => {
        item.addEventListener("click", () => setIsNavOpen(false));
      });
    }
  }, []);

  useEffect(() => {
    if (!Seller.inSellerRoute) {
      if (isNavOpen) {
        document.querySelector(".nav-mobile").className += " nav-active";
        document.querySelector(".bg").style.display = "block";
        document.body.style.overflow = "hidden";
      } else {
        document.querySelector(".nav-mobile").className = "nav-mobile";
        document.querySelector(".bg").style.display = "none";
        document.body.style.overflow = "auto";
      }
    }
  }, [isNavOpen]);

  useEffect(() => {
    if (!Seller.inSellerRoute) {
      const getWidth = () => {
        setWindowSize(window.innerWidth);
      };
      const getScroll = () => {
        setScroll(window.scrollY);
      };

      window.addEventListener("scroll", getScroll);
      window.addEventListener("resize", getWidth);

      if (windowSize > 892) {
        document.body.style.overflow = "auto";
        setIsNavOpen(false);
      } else if (windowSize <= 892 && isNavOpen) {
        document.body.style.overflow = "hidden";
      }

      if (scroll > 15) {
        document.querySelector(".top-nav").classList.add("top-nav-scroll");
      } else {
        document.querySelector(".top-nav").classList.remove("top-nav-scroll");
      }

      return () => {
        window.removeEventListener("resize", getWidth);
      };
    }
  }, [windowSize, scroll]);

  const getCategory = (idx) => {
    window.location.href = `http://localhost:3000/category/${idx}`;
  };

  if (!Seller.inSellerRoute) {
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
                {Seller.isAuthenticated ? (
                  <Link to="/seller/home" style={{ textDecoration: "none" }}>
                    <span style={{ fontWeight: "500" }}>Go To Your Shop</span>
                  </Link>
                ) : (
                  <>
                    {" "}
                    <Link
                      to="/seller/register"
                      style={{ textDecoration: "none", marginRight: "10px" }}
                    >
                      <TinyNavLink>Be A Seller</TinyNavLink>
                    </Link>
                    <Link to="/seller/login" style={{ textDecoration: "none" }}>
                      <TinyNavLink>Login As Seller</TinyNavLink>
                    </Link>
                  </>
                )}
              </section>
            </div>
          </div>
          <div className="top-nav">
            <div className="container">
              <section className="navbar-left">
                <Link
                  to="/"
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                  }}
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
                    id="search-bar"
                    aria-label={"search"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Product, Brand, Category or Seller"
                    className="search-bar"
                  />
                  <button
                    className="navbar-search-icon"
                    aria-label="search-icon"
                  >
                    <FaSearch />
                  </button>
                </form>
              </section>
              <section className="navbar-right">
                {isAuthenticated && user !== null ? (
                  <Link to={`/user/${user.username}`}>
                    <FaUserCircle /> Profile
                  </Link>
                ) : (
                  <Link to="/auth">
                    <FaUserCircle /> Login
                  </Link>
                )}
                <Link to="/wishlist">
                  <FaHeart /> Wishlist
                </Link>
                <Link to="/cart">
                  <FaShoppingCart /> Shopping Cart
                </Link>
                <button
                  className="burger-icon"
                  aria-label="menu-button"
                  onClick={() => setIsNavOpen(true)}
                >
                  <GiHamburgerMenu />
                </button>
              </section>
            </div>
            <div className="container">
              <ul className="category-list">
                {categories.map((category, i) => {
                  return (
                    <li
                      key={i}
                      className="nav-category"
                      onClick={() => getCategory(i)}
                    >
                      <span>{category}</span>
                      <div className="dropdown-content">
                        {subCategories[i] !== undefined &&
                          subCategories[i].map((sub, idx) => {
                            return (
                              <li key={idx}>
                                <Link to={`/category/${i}`}>{sub}</Link>
                              </li>
                            );
                          })}
                      </div>
                    </li>
                  );
                })}
              </ul>
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
            <span className="mobile-logo-text">UralShop</span>
          </section>
          <section className="mobile-nav-middle">
            <ul className="mobile-nav-links">
              <Link to="/wishlist">
                <li>
                  <FaHeart className="mobile-nav-icon" /> Wishlist
                </li>
              </Link>
              <Link to="/cart">
                <li>
                  <FaShoppingCart className="mobile-nav-icon" /> Shopping Cart
                </li>
              </Link>
              <Link to="/categories">
                <li>
                  <CgMenuGridR className="mobile-nav-icon" /> Categories
                </li>
              </Link>
              {isAuthenticated && user !== null ? (
                <Link to={`/user/${user.username}`}>
                  <li>
                    <FaUserCircle className="mobile-nav-icon" /> Profile
                  </li>
                </Link>
              ) : (
                <Link to="/auth">
                  <li>
                    <FaUserCircle className="mobile-nav-icon" /> Login
                  </li>
                </Link>
              )}
            </ul>
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
  }
  return <SellerNavbar />;
};

export default Navbar;
