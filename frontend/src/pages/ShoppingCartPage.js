import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { priceConverter } from "../utils/helpers";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const ItemCount = Styled.span`
  padding-left: 10px;
  padding-top: 5px;
`;

const CartItem = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px
`;

const ShoppingCartPage = () => {
  const Wishlist = useSelector((state) => state.Wishlist);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  useEffect(() => {
    const regex = new RegExp(escapeRegex(searchQuery), "gi");
    if (searchQuery.length < 1) {
      setWishlistItems(Wishlist.products);
    } else {
      setWishlistItems(
        Wishlist.products.filter((item) => item.title.match(regex))
      );
    }
  }, [searchQuery]);

  return (
    <>
      <div className="wishlist-top">
        <section className="left">
          <h4>Shopping Cart</h4>
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
      <div className="cart-container">
        <div className="no-item">
          <FaShoppingCart style={{ fontSize: "4rem" }} />
          <h1 style={{ fontWeight: "300" }}>Shopping Cart Is Empty</h1>
          <p>
            Click "Start Shopping" button to add products to your shopping cart.
          </p>
          <Link to="/">
            <button className="default-btn">Start Shopping</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartPage;
