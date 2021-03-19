import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Styled from "styled-components";
import { Link } from "react-router-dom";

const ItemCount = Styled.span`
  padding-left: 10px;
  padding-top: 5px;
`;

const WishlistPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="wishlist-top">
        <section className="left">
          <h3>My Wishlist</h3>
          <ItemCount>(0 Items)</ItemCount>
        </section>
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap",
          }}
        >
          <section className="navbar-middle">
            <input
              type="text"
              name="searchQuery"
              id="search-bar"
              aria-label={"search"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find Product"
              className="search-bar"
              style={{ width: "250px" }}
            />
            <button className="navbar-search-icon" aria-label="search-icon">
              <FaSearch />
            </button>
          </section>
        </section>
      </div>
      <div className="wishlist-container">
        <div className="no-item">
          <FiHeart style={{ fontSize: "4rem" }} />
          <h1 style={{ fontWeight: "300" }}>Wishlist Is Empty</h1>
          <p>Click "Start Shopping" button to add products to your wishlist.</p>
          <Link to="/">
            <button className="default-btn">Start Shopping</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
