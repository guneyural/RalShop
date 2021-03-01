import React, { useEffect, useState } from "react";
import Styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

const Background = Styled.div`
     background:rgb(0, 0, 0, 0.9);
     position:absolute;
     top:0;
     left:0;
     height:100%;
     width:100%;
     z-index:9999999;
     @media (max-width: 525px) {
          background:black;
     }
`;

const CloseButton = Styled.button`
     background:transparent;
     border:transparent;
     font-size:35px;
     font-weight:bold;
     color:white;
     position:absolute;
     top:50px;
     right:50px;
     @media (max-width: 525px) {
         right: 10px;
     }
`;

const FullscreenImage = ({
  images,
  setIsFullscreen,
  index,
  setIndex,
  prev,
  next,
}) => {
  const [isImagesVisible, setImagesVisible] = useState(true);

  useEffect(() => {
    const getImageSection = document.querySelector(
      ".product-images-section.fullscreen"
    );
    if (isImagesVisible) {
      getImageSection.classList.remove("images-not-visible");
    } else {
      getImageSection.classList.add("images-not-visible");
    }
  }, [isImagesVisible]);

  useEffect(() => {
    const closeFullscreen = (e) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", closeFullscreen);
    return function removeListeners() {
      window.removeEventListener("keydown", closeFullscreen);
    };
  }, []);
  return (
    <Background>
      <CloseButton onClick={() => setIsFullscreen(false)}>
        <FaTimes />
      </CloseButton>
      <button onClick={() => setImagesVisible(!isImagesVisible)}>
        Not Visible
      </button>
      <img
        src={images[index].url}
        alt="big product"
        className="big-product-img"
      />
      <AiFillCaretRight
        className="img-arrows right"
        style={{ fontSize: "40px" }}
        onClick={() => next()}
      />
      <AiFillCaretLeft
        className="img-arrows left"
        style={{ fontSize: "40px" }}
        onClick={() => prev()}
      />
      <section className="product-images-section fullscreen">
        {images.map((item, idx) => {
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
    </Background>
  );
};

export default FullscreenImage;
