import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../redux/actions/productActions";
import NotFound from "./NotFound";
import LoadingIcon from "../assets/loading.gif";
import Styled from "styled-components";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillEdit,
  AiFillHeart,
} from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";
import { FiHeart } from "react-icons/fi";
import FullscreenImage from "./../components/fullscreenImage";
import { priceConverter } from "../utils/helpers";
import ReactStars from "react-rating-stars-component";
import ProductLocation from "../components/ProductLocation";
import ProductDescription from "../components/ProductDescription";
import {
  addReview,
  getReviews,
  deleteReview,
  updateReview,
} from "../redux/actions/productReviewActions";
import NoPhoto from "../assets/noProfilePic.jpg";
import moment from "moment";
import { BsStarFill, BsStarHalf, BsStar, BsTrashFill } from "react-icons/bs";
import MessageBox from "../components/messageBox";
import ReactMarkdown from "react-markdown";
import { addItem, removeItem } from "../redux/actions/wishlistAction";
import { addItem as addCartItem } from "../redux/actions/ShoppingCartActions";
import { createChatroom } from "../redux/actions/chatActions";

const NavDivider = Styled.span`
  font-weight:bold;
  padding-left:5px;
`;
const ProductImages = Styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  height: 400px;
  user-select: none;
  cursor: pointer;
`;
const ImageBottomSection = Styled.section`
  display:flex;
  justify-content:space-between;
  align-items:center;
`;
const InfoRow = Styled.div`
  display: flex;
  justify-content: space-between;
  width:300px;
  padding:8px;
  padding-left:0;
`;
const TickIcon = Styled.span`
  color: white;
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  bottom: -6.3px;
  left: 1px;
  text-shadow: -1px -1px black;
  visibility: hidden;
`;
const ColorPreview = Styled.span`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  margin: 1px;
  border: 1px solid black;
  position: relative;
  &:hover {
    ${TickIcon} {
      visibility: visible;
    }
  }
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
  font-size:20px;
  &:focus{
    outline: none;
  }
`;
const QtyNumber = Styled.span`
  font-size:20px;
`;
const AddButtons = Styled.div`
  display:flex;
  align-items:center;
`;
const TabNav = Styled.nav`
  display:flex;
  justify-content: space-between;
  align-items: center;
`;
const TabList = Styled.li`
  display: inline-block;
  width:100%;
  text-align:center;
  font-weight:500;
  font-size:1.5rem;
  padding:5px;
  transition:0.3s;
  cursor:pointer;

  &:hover{
    background:#efefef;
    box-shadow: inset 0 -2px 0 var(--primary-color);
  }
`;
const StarCount = Styled.p`
  font-size: 15px;
  margin-top:15px;
  color: var(--text-muted);
  text-decoration:underline;
`;
const StarCountSection = Styled.section`
  display:flex;
  position:relative;
  justify-content:space-between;
  align-items:center;
  margin-bottom:-10px;
  width:80%;
   @media (max-width: 900px) {
    width: 100%;
  }
`;
const TextField = Styled.textarea`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
`;
const ProfilePicture = Styled.img`
  height:50px;
  width:50px;
  object-fit:cover;
  border-radius:50%;
`;
const UserInfo = Styled.section`
  display:flex;
  flex-direction: column;
  margin-left: 5px;
`;
const UserSection = Styled.section`
  display:flex;
  justify-content: space-between;
  align-items: center;
`;
const RatingBar = Styled.div`
  position:absolute;
  border-radius: 4px;
  left: 22%;
  width: 60%;
  height: 25px;
  background: #d9d9d9;
  transition: 0.3s;
`;
const RatingBarYellow = Styled.section`
  background: rgb(255, 215, 0);
  border: 1px solid #b39700;
  border-radius: 4px;
  height: 25px;
  transition: 0.3s;
`;

const ProductPage = () => {
  const { id } = useParams();
  let history = useHistory();
  const { error, loading, wishlistCount } = useSelector(
    (state) => state.Product
  );
  const Product = useSelector((state) => state.Product.product);
  const Review = useSelector((state) => state.ProductReview);
  const User = useSelector((state) => state.Auth);
  const Wishlist = useSelector((state) => state.Wishlist);
  const { inSellerRoute } = useSelector((state) => state.Seller);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState("description");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewId, setReviewId] = useState("");
  const [average, setAverage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isReviewEdit, setIsReviewEdit] = useState({
    isEdit: false,
    productId: null,
    reviewRating: null,
    reviewText: null,
  });
  const starRating = {
    size: 27,
    count: 5,
    isHalf: false,
    value: rating,
    onChange: (newRating) => {
      setRating(newRating);
    },
  };

  useEffect(() => {
    if (window.location.hash) {
      let reviewElement = document.getElementById(
        window.location.hash.slice(1)
      );
      if (reviewElement !== null) {
        window.scroll(0, reviewElement.offsetTop);
      }
    }
  }, [Product, reviews]);

  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getReviews(id));
  }, [dispatch, id]);

  useEffect(() => {
    let temp = false;
    if (Wishlist.products.length < 1) {
      setIsInWishlist(temp);
    } else {
      Wishlist.products.some((item) =>
        item._id === id ? (temp = true) : (temp = false)
      );
    }
    setIsInWishlist(temp);
  }, [Wishlist, isInWishlist, id]);

  useEffect(() => {
    const getImage = document.querySelector(
      `.product-images-section img[data-idx="${index}"]`
    );
    document.querySelectorAll(".product-images-section img").forEach((item) => {
      item.classList.remove("product-img-active");
    });
    if (getImage) getImage.classList.add("product-img-active");
  }, [index]);

  useEffect(() => {
    const getColor = document.querySelector(".color-circle");
    const getColorCircle = document.querySelector(".color-circle span");
    if (getColorCircle) getColorCircle.style.visibility = "visible";
    if (getColor) setColor(getColor.getAttribute("id").substring(3));

    const x = document.querySelector(".description");
    if (x) {
      x.innerHTML = Product.description;
      let images = document.querySelectorAll(".description img");
      if (images) {
        images.forEach((item) => {
          item.style.width = "100%";
        });
      }
    }
  }, [Product]);

  useEffect(() => {
    setReviews(Review.productReviews);
    setAverage(Review.average);
  }, [Review, average]);

  const tempStars = Array.from({ length: 5 }, (_, index) => {
    const number = index + 0.5;
    return (
      <span key={index} style={{ fontSize: "24px" }}>
        {average > number ? (
          <BsStarFill style={{ color: "rgb(255, 215, 0)" }} />
        ) : average > index ? (
          <BsStarHalf style={{ color: "rgb(255, 215, 0)" }} />
        ) : (
          <BsStar style={{ color: "rgb(255, 215, 0)" }} />
        )}
      </span>
    );
  });

  const setProductColor = (id) => {
    const getColor = document.querySelectorAll(".color-circle span");
    getColor.forEach((item) => {
      item.style.visibility = "hidden";
    });
    const getCircle = document.querySelector(`#${id} span`);
    if (getCircle) getCircle.style.visibility = "visible";
    setColor(id.substring(3));
  };

  const next = () => {
    if (index >= Product.images.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };
  const prev = () => {
    if (index <= 0) {
      setIndex(Product.images.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  const createReview = (e) => {
    e.preventDefault();
    setSort("default");
    document.querySelector("select[name='sort']").value = "default";
    dispatch(addReview(rating, review, Product._id));
  };

  const showFullscreen = () => {
    setIsFullscreen(true);
    window.scrollTo(0, 0);
  };

  const increaseQty = () => {
    if (Product.stock > qty) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  useEffect(() => {
    const listenKeyboard = (e) => {
      if (e.code === "ArrowLeft") {
        prev();
      }
      if (e.code === "ArrowRight") {
        next();
      }
    };
    document.addEventListener("keydown", listenKeyboard);
    return function removeListener() {
      document.removeEventListener("keydown", listenKeyboard);
    };
  }, [next, prev]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFullscreen]);

  useEffect(() => {
    const getTab = document.querySelector(`.tab-nav-item[data-tab="${tab}"]`);
    const getTabs = document.querySelectorAll(".tab-nav-item");
    if (getTabs)
      getTabs.forEach((item) => item.classList.remove("tab-nav-item-active"));
    if (getTab) getTab.classList.add("tab-nav-item-active");
  }, [tab]);

  useEffect(() => {
    const body = document.querySelector("body");
    if (isModalOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (sort === "default") {
      let sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReviews(sortedReviews);
    }
    if (sort === "DATE_OLD") {
      let sortedReviews = [...reviews].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setReviews(sortedReviews);
    }
    if (sort === "RATING_HIGH") {
      let sortedReviews = [...reviews].sort((a, b) => b.rating - a.rating);
      setReviews(sortedReviews);
    }
    if (sort === "RATING_LOW") {
      let sortedReviews = [...reviews].sort((a, b) => a.rating - b.rating);
      setReviews(sortedReviews);
    }
  }, [sort]);

  const editReview = (item) => {
    dispatch(
      updateReview(item._id, isReviewEdit.reviewRating, isReviewEdit.reviewText)
    );
    setIsReviewEdit({
      isEdit: false,
      productId: null,
      reviewRating: null,
      reviewText: null,
    });
  };

  const removeReview = (reviewId) => {
    setReviewId(reviewId);
    setIsModalOpen(true);
  };

  const communicateSeller = () => {
    dispatch(createChatroom(Product.shop._id, inSellerRoute));
    history.push("/chat");
  };

  if (loading) {
    return (
      <img
        src={LoadingIcon}
        alt="Loading Icon"
        height="100px"
        style={{ display: "grid", margin: "auto" }}
      />
    );
  }
  if (error.msg === "Product Not Found" || error.msg === "Enter Valid Id.") {
    return <NotFound />;
  }
  if (Object.keys(Product).length > 0) {
    return (
      <div>
        {isModalOpen && (
          <MessageBox
            isRedux={true}
            action={deleteReview}
            message={"Do You Want To Delete Your Review ?"}
            setIsModalOpen={setIsModalOpen}
            header={"Delete Review"}
            btnText={"Delete"}
            param={reviewId}
          />
        )}

        {isFullscreen && (
          <FullscreenImage
            setIsFullscreen={setIsFullscreen}
            images={Product.images && Product.images}
            index={index}
            prev={prev}
            next={next}
            setIndex={setIndex}
          />
        )}

        <nav className="breadcrumb" style={{ fontSize: "14px" }}>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            <li style={{ display: "inline", textTransform: "capitalize" }}>
              <Link
                id="product-link"
                to={`/category/${
                  Product.category && Product.category.toLowerCase()
                }`}
              >
                {Product.category}
              </Link>
            </li>
            <NavDivider>></NavDivider>
            <li
              style={{
                display: "inline",
                paddingLeft: "10px",
                textTransform: "capitalize",
              }}
            >
              <Link
                id="product-link"
                to={`/category/${
                  Product.category &&
                  Product.subCategory &&
                  Product.category.toLowerCase()
                }/${Product.subCategory}`}
              >
                {Product.subCategory}
              </Link>
            </li>
            <NavDivider>></NavDivider>
            <li
              style={{
                display: "inline",
                paddingLeft: "10px",
                cursor: "pointer",
                color: "#0d6efd",
              }}
            >
              {Product.brand}
            </li>
          </ul>
        </nav>
        <div className="row" style={{ marginTop: "-20px" }}>
          <h2>{Product.title}</h2>
          <div className="col-md-6">
            {Product.images && (
              <ProductImages
                id="big-product-img"
                onDoubleClick={() => setIsFullscreen(true)}
              >
                <img
                  src={Product.images[index].url}
                  alt="product"
                  className="product-img"
                />
                <AiFillCaretRight
                  className="img-arrows right"
                  onClick={() => next()}
                />
                <AiFillCaretLeft
                  className="img-arrows left"
                  onClick={() => prev()}
                />
              </ProductImages>
            )}
            <ImageBottomSection>
              <span className="img-index" style={{ fontSize: "14px" }}>
                {`${index + 1}/${Product.images && Product.images.length}`}{" "}
                Photo
              </span>
              <button className="btn p-1" onClick={() => showFullscreen()}>
                Fullscreen
              </button>
            </ImageBottomSection>
            <section className="product-images-section">
              {Product.images &&
                Product.images.map((item, idx) => {
                  return (
                    <img
                      data-idx={idx}
                      key={idx}
                      src={item.url}
                      style={{ userSelect: "none" }}
                      onClick={() => setIndex(idx)}
                      className={idx === 0 && "product-img-active"}
                      alt="product"
                    />
                  );
                })}
            </section>
          </div>
          <div className="col-md-6 mb-5">
            <section
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <section>
                <p className="lead" style={{ fontSize: "30px" }}>
                  <strong>{priceConverter(Product.price)}</strong>
                </p>
                <p
                  className={`${
                    Product.stock < 1 ? "text-danger" : "text-success"
                  }`}
                  style={{ marginTop: "-15px" }}
                >
                  <b>{`${Product.stock < 1 ? "Out Of Stock" : "In Stock"}`}</b>
                </p>
                <p
                  className="text-muted"
                  style={{ marginTop: "-15px", fontSize: "14px" }}
                >
                  {`${
                    Product.location.length >= 30
                      ? `${Product.location.substring(0, 30)}...`
                      : Product.location
                  }`}
                </p>
              </section>
              <section>
                <section className="product-star">
                  {tempStars}
                  <section className="rating-small">
                    <section style={{ padding: "15px" }}>
                      <section className="d-flex">
                        {tempStars}
                        <h4 style={{ marginTop: "7px", marginLeft: "5px" }}>
                          {average.toFixed(1)}{" "}
                          <span style={{ fontSize: "22px" }}>out of 5</span>
                        </h4>
                      </section>
                      <StarCountSection>
                        <StarCount>5 Star</StarCount>
                        <RatingBar>
                          <RatingBarYellow
                            style={{
                              width:
                                reviews.length > 0
                                  ? Math.round(
                                      ([
                                        ...reviews.filter(
                                          (item) => item.rating === 5
                                        ),
                                      ].length *
                                        100) /
                                        reviews.length
                                    ) + "%"
                                  : "0%",
                            }}
                          />
                        </RatingBar>
                        <StarCount>
                          %
                          {reviews.length > 0
                            ? Math.round(
                                ([
                                  ...reviews.filter(
                                    (item) => item.rating === 5
                                  ),
                                ].length *
                                  100) /
                                  reviews.length
                              )
                            : "0"}{" "}
                        </StarCount>
                      </StarCountSection>
                      <StarCountSection>
                        <StarCount>4 Star</StarCount>
                        <RatingBar>
                          {" "}
                          <RatingBarYellow
                            style={{
                              width:
                                reviews.length > 0
                                  ? Math.round(
                                      ([
                                        ...reviews.filter(
                                          (item) => item.rating === 4
                                        ),
                                      ].length *
                                        100) /
                                        reviews.length
                                    ) + "%"
                                  : "0%",
                            }}
                          />
                        </RatingBar>
                        <StarCount>
                          %
                          {reviews.length > 0
                            ? Math.round(
                                ([
                                  ...reviews.filter(
                                    (item) => item.rating === 4
                                  ),
                                ].length *
                                  100) /
                                  reviews.length
                              )
                            : "0"}{" "}
                        </StarCount>
                      </StarCountSection>
                      <StarCountSection>
                        <StarCount>3 Star</StarCount>
                        <RatingBar>
                          {" "}
                          <RatingBarYellow
                            style={{
                              width:
                                reviews.length > 0
                                  ? Math.round(
                                      ([
                                        ...reviews.filter(
                                          (item) => item.rating === 3
                                        ),
                                      ].length *
                                        100) /
                                        reviews.length
                                    ) + "%"
                                  : "0%",
                            }}
                          />
                        </RatingBar>
                        <StarCount>
                          %
                          {reviews.length > 0
                            ? Math.round(
                                ([
                                  ...reviews.filter(
                                    (item) => item.rating === 3
                                  ),
                                ].length *
                                  100) /
                                  reviews.length
                              )
                            : "0"}{" "}
                        </StarCount>
                      </StarCountSection>
                      <StarCountSection>
                        <StarCount>2 Star</StarCount>
                        <RatingBar>
                          {" "}
                          <RatingBarYellow
                            style={{
                              width:
                                reviews.length > 0
                                  ? Math.round(
                                      ([
                                        ...reviews.filter(
                                          (item) => item.rating === 2
                                        ),
                                      ].length *
                                        100) /
                                        reviews.length
                                    ) + "%"
                                  : "0%",
                            }}
                          />
                        </RatingBar>
                        <StarCount>
                          %
                          {reviews.length > 0
                            ? Math.round(
                                ([
                                  ...reviews.filter(
                                    (item) => item.rating === 2
                                  ),
                                ].length *
                                  100) /
                                  reviews.length
                              )
                            : "0"}{" "}
                        </StarCount>
                      </StarCountSection>
                      <StarCountSection>
                        <StarCount>1 Star</StarCount>
                        <RatingBar>
                          {" "}
                          <RatingBarYellow
                            style={{
                              width:
                                reviews.length > 0
                                  ? Math.round(
                                      ([
                                        ...reviews.filter(
                                          (item) => item.rating === 1
                                        ),
                                      ].length *
                                        100) /
                                        reviews.length
                                    ) + "%"
                                  : "0%",
                            }}
                          />
                        </RatingBar>
                        <StarCount>
                          %
                          {reviews.length > 0
                            ? Math.round(
                                ([
                                  ...reviews.filter(
                                    (item) => item.rating === 1
                                  ),
                                ].length *
                                  100) /
                                  reviews.length
                              )
                            : "0"}{" "}
                        </StarCount>
                      </StarCountSection>
                    </section>
                    <hr style={{ marginTop: "-5px" }} />
                    <section
                      style={{ textAlign: "center", paddingBottom: "15px" }}
                    >
                      <span
                        className="text-muted"
                        style={{
                          textDecoration: "underline",
                          fontSize: "14px",
                          marginTop: "-15px",
                          cursor: "pointer",
                        }}
                      >
                        <a href="#reviews">See All Reviews</a>
                      </span>
                    </section>
                  </section>
                </section>
                <span
                  className="text-muted"
                  style={{
                    textDecoration: "underline",
                    fontSize: "14px",
                    marginTop: "-15px",
                    cursor: "pointer",
                  }}
                >
                  <a href="#reviews">{reviews.length} Ratings</a>
                </span>
              </section>
            </section>
            <hr />
            <div className="seller-section">
              <section
                style={{
                  background: "#efefef",
                  padding: "15px",
                  paddingBottom: "5px",
                }}
              >
                <section
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link to="/" id="product-link">
                    <h6 style={{ fontSize: "18px" }}>
                      {Product.shop.companyName}{" "}
                      <div className="badge bg-primary">9.4</div>
                    </h6>
                  </Link>
                  <Link to="/" id="product-link">
                    Go To Shop
                  </Link>
                </section>
                <p style={{ marginTop: "-8px" }}>{Product.shop.fullname}</p>
                <p style={{ marginTop: "-10px" }}>{Product.shop.phoneNumber}</p>
                <p style={{ marginTop: "-10px", marginBottom: "0px" }}>
                  <span
                    style={{ color: "#0d6efd", cursor: "pointer" }}
                    id="product-link"
                    onClick={() => communicateSeller()}
                  >
                    Send Message About This Product
                  </span>
                </p>
              </section>
            </div>
            <div className="product-info">
              <InfoRow>
                <span>
                  <b>Brand</b>
                </span>
                <span>{Product.brand}</span>
              </InfoRow>
              <InfoRow>
                <b>Color</b>
                <div style={{ dislay: "flex" }}>
                  {Product.colors.length > 0 &&
                    Product.colors[0].split(",").map((clr, idx) => {
                      return (
                        <ColorPreview
                          className="color-circle"
                          style={{ background: clr }}
                          onClick={() =>
                            setProductColor(
                              `clr${clr.substring(1, clr.length)}`
                            )
                          }
                          key={idx}
                          id={`clr${clr.substring(1, clr.length)}`}
                        >
                          <TickIcon>&#10003;</TickIcon>
                        </ColorPreview>
                      );
                    })}
                </div>
              </InfoRow>
              <InfoRow>
                <b>Quantity</b>
                <QuantitySection>
                  <QtyButton onClick={() => increaseQty()}>
                    <AiOutlinePlus />
                  </QtyButton>
                  <QtyNumber>{qty}</QtyNumber>
                  <QtyButton onClick={() => decreaseQty()}>
                    <AiOutlineMinus />
                  </QtyButton>
                </QuantitySection>
              </InfoRow>
              <AddButtons>
                <button
                  className="default-btn w-100 pt-1 pb-1"
                  style={{ fontSize: "18px" }}
                  onClick={() =>
                    dispatch(
                      addCartItem({
                        product: Product._id,
                        seller: Product.shop._id,
                        price: Product.price,
                        stock: Product.stock,
                        title: Product.title,
                        image: Product.images[0].url,
                        stripeProductId: Product.stripeProductId,
                        stripePriceId: Product.stripePriceId,
                        color,
                        qty,
                        selected: true,
                      })
                    )
                  }
                  disabled={Product.stock < 1 ? true : false}
                >
                  Add To Cart
                </button>
                {User.isAuthenticated ? (
                  <button
                    className="default-btn pt-1 pb-1"
                    style={{
                      fontSize: "18px",
                      borderLeft: "0",
                      fontWeight: "600",
                    }}
                    onClick={() =>
                      isInWishlist
                        ? dispatch(removeItem(id))
                        : dispatch(addItem(Product))
                    }
                  >
                    {isInWishlist ? <AiFillHeart /> : <FiHeart />}
                  </button>
                ) : (
                  <Link to="/auth">
                    <button
                      className="default-btn pt-1 pb-1"
                      style={{
                        fontSize: "18px",
                        borderLeft: "0",
                        fontWeight: "600",
                      }}
                    >
                      <FiHeart />
                    </button>
                  </Link>
                )}
              </AddButtons>
              <div className="w-100" style={{ position: "relative" }}>
                <p
                  style={{ position: "absolute", right: "0" }}
                  className="text-muted"
                >
                  In {wishlistCount} People's Wishlist
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="product-details mt-5">
          <TabNav>
            <ul
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0",
                width: "100%",
              }}
            >
              <TabList
                data-tab="description"
                className="tab-nav-item tab-nav-item-active"
                onClick={() => setTab("description")}
              >
                Description
              </TabList>
              <TabList
                data-tab="location-tab"
                className="tab-nav-item"
                onClick={() => setTab("location-tab")}
              >
                Location
              </TabList>
            </ul>
          </TabNav>
          {Product && (
            <section
              style={{
                background: "white",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {tab === "description" && (
                <ProductDescription Product={Product} />
              )}
              {tab === "location-tab" && (
                <ProductLocation coordinate={Product.coordinate} />
              )}
            </section>
          )}
        </div>
        <div className="review-section mt-5" id="reviews">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h4>Customer Reviews</h4>
              <div
                style={{
                  marginTop: "-15px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {tempStars}
                <p
                  style={{
                    textDecoration: "underline",
                    marginTop: "15px",
                    marginLeft: "5px",
                  }}
                >
                  {reviews.length} Ratings
                </p>
              </div>
              <h3>
                {average.toFixed(1)}{" "}
                <span style={{ fontSize: "22px" }}>out of 5</span>
              </h3>
              <StarCountSection>
                <StarCount>5 Star</StarCount>
                <RatingBar>
                  <RatingBarYellow
                    style={{
                      width:
                        reviews.length > 0
                          ? Math.round(
                              ([...reviews.filter((item) => item.rating === 5)]
                                .length *
                                100) /
                                reviews.length
                            ) + "%"
                          : "0%",
                    }}
                  />
                </RatingBar>
                <StarCount>
                  %
                  {reviews.length > 0
                    ? Math.round(
                        ([...reviews.filter((item) => item.rating === 5)]
                          .length *
                          100) /
                          reviews.length
                      )
                    : "0"}{" "}
                </StarCount>
              </StarCountSection>
              <StarCountSection>
                <StarCount>4 Star</StarCount>
                <RatingBar>
                  {" "}
                  <RatingBarYellow
                    style={{
                      width:
                        reviews.length > 0
                          ? Math.round(
                              ([...reviews.filter((item) => item.rating === 4)]
                                .length *
                                100) /
                                reviews.length
                            ) + "%"
                          : "0%",
                    }}
                  />
                </RatingBar>
                <StarCount>
                  %
                  {reviews.length > 0
                    ? Math.round(
                        ([...reviews.filter((item) => item.rating === 4)]
                          .length *
                          100) /
                          reviews.length
                      )
                    : "0"}{" "}
                </StarCount>
              </StarCountSection>
              <StarCountSection>
                <StarCount>3 Star</StarCount>
                <RatingBar>
                  {" "}
                  <RatingBarYellow
                    style={{
                      width:
                        reviews.length > 0
                          ? Math.round(
                              ([...reviews.filter((item) => item.rating === 3)]
                                .length *
                                100) /
                                reviews.length
                            ) + "%"
                          : "0%",
                    }}
                  />
                </RatingBar>
                <StarCount>
                  %
                  {reviews.length > 0
                    ? Math.round(
                        ([...reviews.filter((item) => item.rating === 3)]
                          .length *
                          100) /
                          reviews.length
                      )
                    : "0"}{" "}
                </StarCount>
              </StarCountSection>
              <StarCountSection>
                <StarCount>2 Star</StarCount>
                <RatingBar>
                  {" "}
                  <RatingBarYellow
                    style={{
                      width:
                        reviews.length > 0
                          ? Math.round(
                              ([...reviews.filter((item) => item.rating === 2)]
                                .length *
                                100) /
                                reviews.length
                            ) + "%"
                          : "0%",
                    }}
                  />
                </RatingBar>
                <StarCount>
                  %
                  {reviews.length > 0
                    ? Math.round(
                        ([...reviews.filter((item) => item.rating === 2)]
                          .length *
                          100) /
                          reviews.length
                      )
                    : "0"}{" "}
                </StarCount>
              </StarCountSection>
              <StarCountSection>
                <StarCount>1 Star</StarCount>
                <RatingBar>
                  {" "}
                  <RatingBarYellow
                    style={{
                      width:
                        reviews.length > 0
                          ? Math.round(
                              ([...reviews.filter((item) => item.rating === 1)]
                                .length *
                                100) /
                                reviews.length
                            ) + "%"
                          : "0%",
                    }}
                  />
                </RatingBar>
                <StarCount>
                  %
                  {reviews.length > 0
                    ? Math.round(
                        ([...reviews.filter((item) => item.rating === 1)]
                          .length *
                          100) /
                          reviews.length
                      )
                    : "0"}{" "}
                </StarCount>
              </StarCountSection>
            </div>
            <div className="col-md-8">
              <section
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h1>Reviews</h1>
                <section>
                  <label htmlFor="sort">Sort By:</label>{" "}
                  <select
                    name="sort"
                    id="sort"
                    onChange={(e) => setSort(e.target.value)}
                    className="default-btn p-1 sort-dropdown"
                    style={{
                      background: "#e9e9e9",
                      color: "var(--primary-color)",
                      cursor: "pointer",
                    }}
                    required
                  >
                    <option value="default">Default (newest first)</option>
                    <option value="DATE_OLD">Date (oldest first)</option>
                    <option value="RATING_LOW">
                      Rating (lowest rating first)
                    </option>
                    <option value="RATING_HIGH">
                      Rating (highest rating first)
                    </option>
                  </select>
                </section>
              </section>
              {User.isAuthenticated && (
                <section>
                  <h5>Add Review</h5>
                  <form
                    onSubmit={(e) => createReview(e)}
                    style={{ marginTop: "-12px" }}
                  >
                    <ReactStars {...starRating} />
                    <div className="update-review-section">
                      <TextField
                        placeholder="Write at least 10 characters long reviews. Good reviews are usually 100 characters or more."
                        tabIndex={1}
                        rows="4"
                        cols="50"
                        style={{ width: "100%" }}
                        name="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />
                    </div>
                    <button className="default-btn mt-1">Add Review</button>
                  </form>
                </section>
              )}
              <hr />
              {Review.error.message && (
                <span className="text-danger mb-3">{Review.error.message}</span>
              )}
              {Review.error.status === 429 && (
                <span className="text-danger mb-3">
                  Try again later. You reached your limits.
                </span>
              )}
              {Review.loading && (
                <img
                  src={LoadingIcon}
                  alt="Loading Icon"
                  height="80px"
                  style={{ display: "grid", margin: "auto" }}
                />
              )}
              <div className="reviews">
                {reviews.length < 1 && <p>No review added.</p>}
                {reviews.map((item, id) => {
                  return (
                    <div className="review-item mb-4" key={id} id={item._id}>
                      <UserSection>
                        <div className="d-flex">
                          <ProfilePicture
                            src={
                              item.user.hasPhoto
                                ? item.user.profilePhoto.url
                                : NoPhoto
                            }
                            alt="profile"
                          />
                          <UserInfo>
                            <span
                              className="username"
                              style={{ fontWeight: "500" }}
                            >
                              {item.user.username}
                            </span>
                            <span
                              className="text-muted"
                              style={{ fontSize: "14px" }}
                            >
                              {moment(item.createdAt).format("ll")}
                            </span>
                          </UserInfo>
                        </div>
                        {User.user &&
                          item.user &&
                          User.user._id === item.user._id && (
                            <div className="review-settings" tabIndex="2">
                              <button
                                style={{
                                  fontSize: "20px",
                                  background: "transparent",
                                  border: "transparent",
                                }}
                                className="review-settings-btn"
                              >
                                <HiDotsVertical />
                              </button>
                              <div className="review-settings-list">
                                <button
                                  onMouseDown={() => {
                                    setIsReviewEdit({
                                      isEdit: true,
                                      productId: item._id,
                                      reviewRating: item.rating,
                                      reviewText: item.text,
                                    });
                                  }}
                                >
                                  <AiFillEdit style={{ color: "gray" }} /> Edit
                                </button>
                                <button
                                  onMouseDown={() => removeReview(item._id)}
                                >
                                  <BsTrashFill
                                    style={{
                                      color: "gray",
                                      marginRight: "3px",
                                    }}
                                  />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                      </UserSection>
                      {isReviewEdit.productId !== item._id ? (
                        <>
                          <span>
                            {[...Array(item.rating)].map((item, index) => {
                              return (
                                <BsStarFill
                                  key={index}
                                  style={{
                                    color: "rgb(255, 215, 0)",
                                    margin: "1px",
                                  }}
                                />
                              );
                            })}
                            {[...Array(5 - item.rating)].map((item, index) => {
                              return (
                                <BsStarFill
                                  key={index}
                                  style={{ margin: "1px", color: "gray" }}
                                />
                              );
                            })}
                          </span>
                          <section className="mt-2 review-text">
                            <ReactMarkdown>{item.text}</ReactMarkdown>
                          </section>
                        </>
                      ) : (
                        item._id === isReviewEdit.productId && (
                          <section>
                            <form
                              onSubmit={(e) => e.preventDefault()}
                              style={{ marginTop: "-12px" }}
                            >
                              <ReactStars
                                {...starRating}
                                value={isReviewEdit.reviewRating}
                                onChange={(rating) =>
                                  setIsReviewEdit({
                                    ...isReviewEdit,
                                    reviewRating: rating,
                                  })
                                }
                              />
                              <div className="update-review-section">
                                <TextField
                                  tabIndex={1}
                                  rows="4"
                                  cols="50"
                                  style={{ width: "100%" }}
                                  name="review"
                                  value={isReviewEdit.reviewText}
                                  onChange={(e) =>
                                    setIsReviewEdit({
                                      ...isReviewEdit,
                                      reviewText: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <button
                                className="default-btn mt-1"
                                onClick={() => editReview(item)}
                              >
                                Edit
                              </button>
                              <span
                                className="btn"
                                onClick={() =>
                                  setIsReviewEdit({
                                    isEdit: false,
                                    productId: null,
                                    reviewRating: null,
                                    reviewText: null,
                                  })
                                }
                              >
                                Cancel
                              </span>
                            </form>
                          </section>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
};

export default ProductPage;
