import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeAllItems } from "../redux/actions/wishlistAction";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { priceConverter } from "../utils/helpers";
import { removeItem } from "../redux/actions/wishlistAction";
import { addItem as addCartItem } from "../redux/actions/ShoppingCartActions";

const ItemCount = Styled.span`
  padding-left: 10px;
  padding-top: 5px;
`;

const WishlistItem = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px
`;

const WishlistPage = () => {
  const Wishlist = useSelector((state) => state.Wishlist);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  useEffect(() => {
    setWishlistItems(Wishlist.products);
  }, [Wishlist]);

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

  const moveToCart = (product) => {
    dispatch(
      addCartItem({
        product: product._id,
        price: product.price,
        stock: product.stock,
        title: product.title,
        image: product.images[0].url,
        color: product.colors[0].split(",")[0].substring(1),
        qty: 1,
      })
    );
    dispatch(removeItem(product._id));
  };

  return (
    <>
      <div className="wishlist-top">
        <section className="left">
          <h3>My Wishlist</h3>
          <ItemCount>({Wishlist.products.length} Items)</ItemCount>
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
      {Wishlist.products.length > 0 && (
        <button
          onClick={() => dispatch(removeAllItems())}
          style={{
            color: "#0d6efd",
            fontSize: "15px",
            marginTop: "5px",
            background: "transparent",
            border: "transparent",
            padding: "0",
          }}
        >
          Remove All
        </button>
      )}
      <div className="wishlist-container">
        {wishlistItems.length < 1 ? (
          <div className="no-item">
            <FiHeart style={{ fontSize: "4rem" }} />
            <h1 style={{ fontWeight: "300" }}>Wishlist Is Empty</h1>
            <p>
              Click "Start Shopping" button to add products to your wishlist.
            </p>
            <Link to="/">
              <button className="default-btn">Start Shopping</button>
            </Link>
          </div>
        ) : (
          wishlistItems.map((item, idx) => {
            return (
              <WishlistItem key={idx}>
                <section style={{ display: "flex" }}>
                  <Link to={`/product/${item._id}`}>
                    <img
                      className="wishlist-img"
                      src={item.images[0].url}
                      alt="product"
                      style={{
                        objectFit: "cover",
                        width: "180px",
                        height: "170px",
                        borderRadius: "3px",
                      }}
                    />
                  </Link>
                  <section style={{ marginLeft: "10px" }}>
                    <Link
                      to={`/product/${item._id}`}
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                      }}
                    >
                      <h6>{item.title}</h6>
                      <section
                        style={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          marginTop: "-8px",
                        }}
                      >
                        {item.stock < 1 ? (
                          <span className="text-danger">Out Of Stock</span>
                        ) : (
                          <span className="text-success">In Stock</span>
                        )}
                      </section>
                      <p style={{ marginTop: "-3px" }}>
                        {Array.from({ length: 5 }, (_, index) => {
                          const number = index + 0.5;
                          return (
                            <span key={index} style={{ fontSize: "18px" }}>
                              {item.rating > number ? (
                                <BsStarFill
                                  style={{ color: "rgb(240, 204, 0)" }}
                                />
                              ) : item.rating > index ? (
                                <BsStarHalf
                                  style={{ color: "rgb(240, 204, 0)" }}
                                />
                              ) : (
                                <BsStar style={{ color: "rgb(240, 204, 0)" }} />
                              )}
                            </span>
                          );
                        })}
                      </p>
                      <p
                        style={{
                          marginTop: "-15px",
                          fontSize: "15px",
                        }}
                        className="text-muted"
                      >
                        {item.rating.toFixed(1)} Out Of 5
                      </p>
                      <p
                        style={{
                          marginTop: "-10px",
                          fontWeight: "500",
                        }}
                      >
                        {priceConverter(item.price)}
                      </p>
                    </Link>
                    <section
                      style={{ fontSize: "15px", color: "#0d6efd" }}
                      className="wishlist-options"
                    >
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => dispatch(removeItem(item._id))}
                      >
                        Delete
                      </span>
                      {item.stock > 0 && (
                        <span
                          style={{
                            display: "inline-block",
                            marginLeft: "8px",
                            cursor: "pointer",
                          }}
                          className="option-2"
                          onClick={() => moveToCart(item)}
                        >
                          Move To Cart
                        </span>
                      )}
                    </section>
                  </section>
                </section>
              </WishlistItem>
            );
          })
        )}
      </div>
    </>
  );
};

export default WishlistPage;
