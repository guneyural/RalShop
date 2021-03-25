import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { priceConverter } from "../utils/helpers";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCartItem,
  removeAllCart,
  increaseCartItem,
  decreaseCartItem,
} from "../redux/actions/ShoppingCartActions";

const ItemCount = Styled.span`
  padding-left: 10px;
  padding-top: 3px;
`;

const CartItem = Styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px
`;

const StockText = Styled.p`
  font-size:12px;
  font-weight:300px;
  margin-top:-12px;
`;

const QuantitySection = Styled.section`
  display:flex;
  align-items:center;
`;
const QtyButton = Styled.button`
  background:transparent;
  border:transparent;
  padding:2px;
  font-weight:bold;
  font-size:18px;
  &:focus{
    outline: none;
  }
`;
const QtyNumber = Styled.span`
  font-size:15px;
`;

const ColorPreview = Styled.span`
  height: 14px;
  width: 14px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  border: 1px solid black;
  position: relative;
  margin-left: 3px;
  top: 3px;
`;

const ShoppingCartPage = () => {
  const Cart = useSelector((state) => state.Cart);
  const User = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  useEffect(() => {
    setCartItems(Cart.products);
    let sum = 0;
    Cart.products.map((item) => (sum += item.price));
    setCartTotal(sum);
  }, [Cart]);

  useEffect(() => {
    const regex = new RegExp(escapeRegex(searchQuery), "gi");
    if (searchQuery.length < 1) {
      setCartItems(Cart.products);
    } else {
      setCartItems(Cart.products.filter((item) => item.title.match(regex)));
    }
  }, [searchQuery]);

  return (
    <>
      <div className="wishlist-top">
        <section className="left">
          <h4>Shopping Cart</h4>
          <ItemCount>({cartItems.length} Items)</ItemCount>
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
      {Cart.products.length > 0 && (
        <section
          className="proceed-to-checkout"
          style={{ marginBottom: "-10px" }}
        >
          <section>
            <p style={{ fontWeight: "500" }}>
              Subtotal ({Cart.products.length} items): <br />
              <span style={{ fontWeight: "bold" }}>
                {priceConverter(cartTotal)}
              </span>
            </p>
            <span
              style={{
                cursor: "pointer",
                color: "rgb(13, 110, 253)",
                fontSize: "14px",
              }}
              onClick={() => dispatch(removeAllCart())}
            >
              Remove All
            </span>
          </section>
          {User.isAuthenticated ? (
            <button className="default-btn">Proceed To Checkout</button>
          ) : (
            <Link to="/auth">
              <button className="default-btn">Proceed To Checkout</button>
            </Link>
          )}
        </section>
      )}
      {cartItems.length > 0 && (
        <div className="mt-2" style={{ position: "relative" }}>
          <span
            style={{
              textAlign: "left",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            Product
          </span>
          <span
            style={{
              position: "absolute",
              right: "0",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            Price
          </span>
          <hr style={{ marginTop: "-0px", marginBottom: "-15px" }} />
        </div>
      )}
      <div className="cart-container">
        {cartItems.length < 1 ? (
          <div className="no-item">
            <FaShoppingCart style={{ fontSize: "4rem" }} />
            <h1 style={{ fontWeight: "300" }}>Shopping Cart Is Empty</h1>
            <p>
              Click "Start Shopping" button to add products to your shopping
              cart.
            </p>
            <Link to="/">
              <button className="default-btn">Start Shopping</button>
            </Link>
          </div>
        ) : (
          cartItems.map((item, idx) => {
            return (
              <>
                <CartItem key={idx} id="shopping-cart-section">
                  <section className="d-flex" style={{ marginTop: "3px" }}>
                    <Link to={`/product/${item.product}`}>
                      <img
                        className="wishlist-img"
                        id="shopping-cart-img"
                        src={item.image}
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
                        to={`/product/${item.product}`}
                        style={{
                          color: "var(--primary-color)",
                          textDecoration: "none",
                        }}
                      >
                        <p id="shopping-cart-title">{item.title}</p>
                      </Link>
                      <StockText
                        className={
                          item.stock < 1 ? "text-danger" : "text-success"
                        }
                      >
                        {item.stock < 1 ? "Out Of Stock" : "In Stock"}
                      </StockText>
                      <section
                        className="d-flex"
                        style={{
                          padding: "0",
                          marginTop: "-35px",
                        }}
                      >
                        <p style={{ paddingTop: "23px", fontSize: "14px" }}>
                          qty:{" "}
                        </p>
                        <QuantitySection style={{ paddingTop: "3px" }}>
                          <QtyButton
                            onClick={() =>
                              dispatch(
                                increaseCartItem(item.product, item.color)
                              )
                            }
                          >
                            <AiOutlinePlus />
                          </QtyButton>
                          <QtyNumber>{item.qty}</QtyNumber>
                          <QtyButton
                            onClick={() =>
                              dispatch(
                                decreaseCartItem(item.product, item.color)
                              )
                            }
                          >
                            <AiOutlineMinus />
                          </QtyButton>
                        </QuantitySection>
                      </section>
                      <section style={{ marginTop: "-10px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "13px",
                          }}
                        >
                          Color:
                        </span>
                        <ColorPreview
                          style={{ background: `#${item.color}` }}
                        ></ColorPreview>
                      </section>
                      <section
                        style={{
                          fontSize: "14px",
                          color: "#0d6efd",
                          marginTop: "5px",
                        }}
                        className="wishlist-options"
                      >
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            dispatch(removeCartItem(item.product, item.color))
                          }
                        >
                          Delete
                        </span>
                        <span
                          style={{
                            display: "inline-block",
                            marginLeft: "8px",
                            cursor: "pointer",
                          }}
                          className="option-2"
                        >
                          Move To Wishlist
                        </span>
                      </section>
                    </section>
                  </section>
                  <section>
                    <p style={{ fontWeight: "600" }}>
                      {priceConverter(item.price)}
                    </p>
                  </section>
                </CartItem>
                <hr />
              </>
            );
          })
        )}
      </div>
    </>
  );
};

export default ShoppingCartPage;
