import React, { useState, useEffect } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../redux/actions/productActions";
import NotFound from "./NotFound";
import LoadingIcon from "../assets/loading.gif";
import Styled from "styled-components";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import FullscreenImage from "./../components/fullscreenImage";

const NavDivider = Styled.span`
     font-weight:bold;
     padding-left:5px;
`;

const ProductImages = Styled.div`
     height: 100%;
     width: 100%;
     position: relative;
     max-width: 600px;
     height: 400px;
`;

const ImageBottomSection = Styled.section`
     display:flex;
     justify-content:space-between;
     align-items:center;
     max-width:600px;
`;

const ProductPage = () => {
  const { id } = useParams();
  const { error, loading } = useSelector((state) => state.Product);
  const Product = useSelector((state) => state.Product.product);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const getImage = document.querySelector(
      `.product-images-section img[data-idx="${index}"]`
    );
    document.querySelectorAll(".product-images-section img").forEach((item) => {
      item.classList.remove("product-img-active");
    });
    if (getImage) getImage.classList.add("product-img-active");
  }, [index]);

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

  const showFullscreen = () => {
    setIsFullscreen(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const listenKeyboard = (e) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowDown") {
        prev();
      }
      if (e.code === "ArrowRight" || e.code === "ArrowUp") {
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
                to={`/category/${
                  Product.category && Product.category.toLowerCase()
                }`}
                style={{ textDecoration: "none" }}
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
                to={`/category/${
                  Product.category &&
                  Product.subCategory &&
                  Product.category.toLowerCase()
                }/${Product.subCategory}`}
                style={{ textDecoration: "none" }}
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
              <ProductImages>
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
                      onClick={() => setIndex(idx)}
                      className={idx === 0 && "product-img-active"}
                      alt="product"
                    />
                  );
                })}
            </section>
          </div>
          <div className="col-md-6">Second-col</div>
        </div>
      </div>
    );
  }
  return <></>;
};

export default ProductPage;
