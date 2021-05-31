import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CategoriesBox from "../components/HomePageCategoriesBox";
import OnlyLoggedInUsers from "../components/HomePageOnlyLoggedInUsers";
import HomePageSection from "../components/HomePageSection";
import HomeCategory from "../assets/home.jpeg";
import ElectronicCategory from "../assets/electronic.jpeg";
import styled from "styled-components";
import Kid from "../assets/kid2.jpeg";
import Cosmetic from "../assets/cosmetic2.jpeg";
import WatchAndAccessories from "../assets/watchAndAccessories2.jpeg";
import Vehicle from "../assets/Vehicle.jpeg";
import ShoeAndBag from "../assets/shoebag.jpeg";
import Woman from "../assets/women2.jpeg";
import Man from "../assets/man2.jpeg";
import StartShopping from "../assets/startShopping.jpeg";

const CategoriesSection = styled.div`
  margin-top: 20px;
`;
const CategoryImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: 0.4s;
`;
const CategoryText = styled.h1`
  position: absolute;
  color: white;
  opacity: 0;
  transition: 0.4s;
  font-weight: bold;
`;
const BlackBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: black;
  border-radius: 12px;
  opacity: 0;
  transition: 0.4s;

  &:hover {
    opacity: 0.5;
  }
`;
const CategoryItem = styled.div`
  height: 200px;
  border-radius: 12px;
  cursor: pointer;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  position: relative;

  &:hover {
    ${CategoryText} {
      opacity: 1;
    }
    ${BlackBackground} {
      opacity: 0.5;
    }
  }
`;

const HomePage = () => {
  const history = useHistory();
  const { isAuthenticated } = useSelector((state) => state.Auth);
  const [Categories, setCategories] = useState([
    { img: Woman, link: "/category/Woman", text: "Woman" },
    { img: Man, link: "/category/Man", text: "Man" },
    { img: Kid, link: "/category/Kid", text: "Kid" },
    { img: Cosmetic, link: "/category/Cosmetic", text: "Cosmetic" },
    {
      img: WatchAndAccessories,
      link: "category/watch%20&%20accessories",
      text: "Watch & Accessories",
    },
    {
      img: ShoeAndBag,
      link: "/category/Shoes%20&%20Bag",
      text: "Shoes & Bags",
    },
    { img: HomeCategory, link: "/category/Home", text: "Home" },
    {
      img: ElectronicCategory,
      link: "/category/Electronic",
      text: "Electronic",
    },
    { img: Vehicle, link: "/category/Vehicle", text: "Vehicle" },
    { img: StartShopping, link: "/", text: "Start Shopping" },
  ]);

  return (
    <div>
      <CategoriesBox />
      {isAuthenticated && <OnlyLoggedInUsers />}
      <HomePageSection />
      <CategoriesSection>
        <h4 style={{ fontWeight: "bolder", textAlign: "center" }}>
          Shop By Category
        </h4>
        <div className="row">
          {Categories.map((item, index) => {
            return (
              <div
                className="col-6 mt-3"
                onClick={() => history.push(item.link)}
                key={index}
              >
                <CategoryItem
                  className="w-100"
                  onClick={() => history.push(item.link)}
                >
                  <BlackBackground />
                  <CategoryText>{item.text}</CategoryText>
                  <CategoryImg src={item.img} alt="category item" />
                </CategoryItem>
              </div>
            );
          })}
        </div>
      </CategoriesSection>
    </div>
  );
};

export default HomePage;
