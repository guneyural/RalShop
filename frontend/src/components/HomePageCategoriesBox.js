import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Electronic from "../assets/electronic.jpeg";
import Man from "../assets/man.jpg";
import Home from "../assets/home.jpeg";
import Kid from "../assets/kid.jpg";
import Woman from "../assets/Woman.png";
import Cosmetic from "../assets/cosmetic.jpeg";
import WatchAndAccessories from "../assets/watchAndAccessories.jpeg";
import ShoesAndBag from "../assets/shoesAndBag.jpeg";
import Vehicle from "../assets/Vehicle.jpeg";

const CategoriesContainer = styled.div`
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  overflow-x: auto;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  margin: auto;

  @media (max-width: 1000px) {
    width: 90%;
  }

  @media (max-width: 767px) {
    width: 100%;
    min-width: 100%;
  }

  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-track {
    background: #dddddd;
  }
  &::-webkit-scrollbar-thumb {
    background: #acaaaa;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #c2c2c2;
  }
`;
const CategoryItemSection = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 11px;
  text-align: center;
  white-space: nowrap;
  margin-left: 7px;
  cursor: pointer;
`;
const CategoryCircle = styled.div`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: #dedede;
`;
const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  margin: 0;
  padding: 0;
  object-fit: cover;
`;

const HomePageCategoriesBox = () => {
  const history = useHistory();
  const [categories, setCategories] = useState([
    { name: "Woman", img: Woman, link: "/category/Woman" },
    { name: "Man", img: Man, link: "/category/Man" },
    { name: "Kid", img: Kid, link: "/category/Kid" },
    { name: "Home", img: Home, link: "/category/Home" },
    { name: "Cosmetic", img: Cosmetic, link: "/category/Cosmetic" },
    {
      name: "Shoes & Bag",
      img: ShoesAndBag,
      link: "/category/Shoes%20&%20Bag",
    },
    {
      name: "Watch & Accessories",
      img: WatchAndAccessories,
      link: "/category/Watch%20&%20Bag",
    },
    { name: "Electronic", img: Electronic, link: "/category/Electronic" },
    { name: "Vehicle", img: Vehicle, link: "/category/Vehicle" },
  ]);

  return (
    <div>
      <CategoriesContainer>
        {categories.map((item, index) => {
          return (
            <CategoryItemSection
              key={index}
              onClick={() => history.push(item.link)}
            >
              <CategoryCircle
                style={
                  index === categories.length - 1
                    ? { marginRight: "10px", marginLeft: "7px" }
                    : {}
                }
              >
                <CategoryImage src={item.img} alt="category item" />
              </CategoryCircle>
              <p
                style={
                  index === categories.length - 1
                    ? { margin: "0", marginLeft: "-10px" }
                    : { margin: "0" }
                }
              >{`${item.name.substring(0, 11)}${
                item.name.length > 11 ? "..." : ""
              }`}</p>
            </CategoryItemSection>
          );
        })}
      </CategoriesContainer>
    </div>
  );
};

export default HomePageCategoriesBox;
