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
import Logo from "../assets/logo.png";

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
const LoginSection = styled.div`
  background: white;
  border-radius: 16px;
  display: flex;
  margin: auto;
  justify-content: space-between;
  width: 50%;
  align-items: center;
  padding: 8px 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

  @media (max-width: 912px) {
    width: 60%;
  }
  @media (max-width: 768px) {
    width: 75%;
  }
  @media (max-width: 720px) {
    padding: 4px 12px;
  }
  @media (max-width: 560px) {
    width: 85%;
  }
  @media (max-width: 560px) {
    width: 100%;
  }
  @media (max-width: 430px) {
    padding: 8px 8px;
  }
`;
const LogoImage = styled.img`
  @media (max-width: 430px) {
    width: 65px;
    height: 65px;
  }
  @media (max-width: 340px) {
    width: 60px;
    height: 60px;
    margin-top: -5px;
  }
`;
const LoginText = styled.h4`
  font-weight: bolder;
  text-align: center;

  @media (max-width: 400px) {
    font-size: 18px;
  }
  @media (max-width: 340px) {
    font-size: 17px;
  }
`;
const LoginButton = styled.button`
  width: 25%;
  border-radius: 22px;

  &:focus {
    outline: 0;
  }

  @media (max-width: 376px) {
    width: 20%;
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
      {isAuthenticated ? (
        <OnlyLoggedInUsers />
      ) : (
        <LoginSection>
          <div>
            <LogoImage src={Logo} alt="logo" height="80" />
          </div>
          <div>
            <LoginText>Login To See More</LoginText>
            <p style={{ margin: "0", marginTop: "-5px", fontSize: "15px" }}>
              Ural Shop
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "-5px",
              }}
            >
              Guney Ural @ 2021
            </p>
          </div>
          <LoginButton
            className="default-btn"
            style={{ width: "25%" }}
            onClick={() => history.push("/auth")}
          >
            Login
          </LoginButton>
        </LoginSection>
      )}
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
