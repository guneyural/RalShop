import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addItem as addItemToCart } from "../redux/actions/ShoppingCartActions";
import {
  addItem as addItemToWishlist,
  removeItem as removeItemFromWishlist,
} from "../redux/actions/wishlistAction";
import {
  BsHeart,
  BsHeartFill,
  BsStar,
  BsStarHalf,
  BsStarFill,
} from "react-icons/bs";
import { MdColorLens } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { priceConverter } from "../utils/helpers";

const ProductBox = styled.div`
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  height: 350px;
  margin: auto;
  width: 95%;
  margin-bottom: 30px;
  position: relative;
  background: white;
  transition: 0.3s;
  box-shadow: rgba(0, 0, 0, 0.05) 1px 1px 1px 1px;

  &:hover {
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 880px) {
    width: 100%;
  }
  @media (max-width: 400px) {
    height: 380px;
  }
`;
const ProductBoxImageSection = styled.div`
  position: relative;
`;
const ProductImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  cursor: pointer;
`;
const WishlistButton = styled.button`
  position: absolute;
  top: 3px;
  right: 3px;
  border-radius: 50%;
  background: white;
  border: 1.2px solid #333;

  &:focus {
    outline: none;
  }
`;
const ShoppingCartButton = styled.button`
  width: 90%;
  padding: 3px 7px;
  font-size: 15px;
  &:focus: {
    outline: 0;
  }
`;
const ProductBoxBottom = styled.div`
  width: 100%;
  position: absolute;
  text-align: center;
  bottom: 5px;
`;
const ProductBoxCenter = styled.div`
  overflow: hidden;
  padding: 3px 5px;
`;
const ProductTitle = styled.span`
  font-size: 13px;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;
const SellerName = styled.span`
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
`;
const StarSection = styled.div`
  font-size: 13px;
  color: var(--text-muted);
`;
const PriceText = styled.span`
  font-weight: bold;
  font-size: 15px;
`;
const ColorBox = styled.button`
  position: absolute;
  bottom: 3px;
  right: 3px;
  border-radius: 5px;
  background: white;
  border: 1.2px solid #333;
  padding: 0 3px;
`;

const ListProducts = ({ DefaultProducts, ListedProducts }) => {
  const [defaultProducts, setDefaultProducts] = useState(DefaultProducts);
  const [listedProducts, setListedProducts] = useState(ListedProducts);
  const history = useHistory();
  const dispatch = useDispatch();
  const Wishlist = useSelector((state) => state.Wishlist);
  const Cart = useSelector((state) => state.Cart);

  useEffect(() => setListedProducts(ListedProducts), [ListedProducts]);

  const checkWishlist = (id) => {
    let temp = false;
    if (Wishlist.products.length < 1) {
      return temp;
    } else {
      Wishlist.products.some((item) =>
        item._id === id ? (temp = true) : (temp = false)
      );
    }
    return temp;
  };

  return (
    <div className="row">
      {listedProducts.map((item, index) => {
        return (
          <div
            className="col-md-4 col-6"
            style={{ padding: "2px" }}
            key={index}
          >
            <ProductBox>
              <ProductBoxImageSection>
                <ProductImage
                  src={item.images[0].url}
                  alt="product"
                  onClick={() => history.push(`/product/${item._id}`)}
                />
                <WishlistButton
                  onClick={() =>
                    checkWishlist(item._id)
                      ? dispatch(removeItemFromWishlist(item._id))
                      : dispatch(addItemToWishlist(item))
                  }
                >
                  {checkWishlist(item._id) ? <BsHeartFill /> : <BsHeart />}
                </WishlistButton>
                {item.colors[0].split(",").length > 1 && (
                  <ColorBox>
                    <MdColorLens />{" "}
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {item.colors[0].split(",").length}
                    </span>
                  </ColorBox>
                )}
              </ProductBoxImageSection>
              <ProductBoxCenter>
                <SellerName
                  onClick={() => history.push(`/product/${item._id}`)}
                >
                  {item.shop.companyName}{" "}
                </SellerName>
                <ProductTitle
                  onClick={() => history.push(`/product/${item._id}`)}
                >
                  {item.title.substring(0, 50)}
                  {item.title.length >= 50 && "..."}
                </ProductTitle>
                <br />
                <StarSection>
                  {Array.from({ length: 5 }, (_, index) => {
                    const number = index + 0.5;
                    return (
                      <span key={index}>
                        {item.rating > number ? (
                          <BsStarFill style={{ color: "rgb(255, 215, 0)" }} />
                        ) : item.rating > index ? (
                          <BsStarHalf style={{ color: "rgb(255, 215, 0)" }} />
                        ) : (
                          <BsStar style={{ color: "rgb(255, 215, 0)" }} />
                        )}
                      </span>
                    );
                  })}
                  <span> {item.rating.toFixed(1)}/5</span>
                </StarSection>
                <PriceText>{priceConverter(item.price)}</PriceText>
              </ProductBoxCenter>
              <ProductBoxBottom>
                <ShoppingCartButton
                  className="default-btn"
                  onClick={() =>
                    dispatch(
                      addItemToCart({
                        product: item._id,
                        seller: item.shop,
                        price: item.price,
                        stock: item.stock,
                        title: item.title,
                        image: item.images[0].url,
                        color: item.colors[0].split(",")[0].substring(1),
                        stripeProductId: item.stripeProductId,
                        stripePriceId: item.stripePriceId,
                        qty: 1,
                        selected: true,
                      })
                    )
                  }
                >
                  <FaShoppingCart /> Add To Cart
                </ShoppingCartButton>
              </ProductBoxBottom>
            </ProductBox>
          </div>
        );
      })}
    </div>
  );
};

export default ListProducts;
