import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";
import { useParams } from "react-router-dom";

const FilterType = styled.p`
  font-size: 15px;
  font-weight: bold;
`;
const FilterTypeSection = styled.div``;
const StarSection = styled.p`
  font-size: 13px;
  color: var(--text-muted);
  padding: 0;
  margin-top: -10px;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: black;
  }
`;
const PriceRangeSection = styled.div`
  display: flex;
`;
const InputField = styled.input`
  padding: 3px;
  border-radius: 3px;
  background: #efefef;
  width: 70px;
  border: 1px solid #c2c2c2;
  font-size: 14px;
  margin: -1px 2px;
  color: var(--text-muted);
`;
const BrandsSection = styled.div`
  margin-top: -10px;
  font-size: 13px;
  color: var(--text-muted);
  min-height: 70px;
  width: 150px;
  overflow-y: auto;
  padding: 0;
`;
const BrandItem = styled.p`
  cursor: pointer;
  padding: 0;
  margin: 0;
  user-select: none;
  &:hover {
    color: black;
  }
`;
const OutOfStockSection = styled.div`
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 13px;
  display: flex;
`;

const ProductFilters = ({
  DefaultProducts = [],
  ListedProducts = [],
  Brands = [],
  Sellers = [],
  setListProducts,
  selectedCategory = "",
  Categories = [],
  Brand,
}) => {
  const { subCategory } = useParams();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [brand, setBrand] = useState(Brand !== "none" ? Brand : "");
  const [stars, setStars] = useState(0);
  const [seller, setSeller] = useState("");
  const [category, setCategory] = useState(subCategory);
  const [showMultipleColorOptions, setShowMultipleColorOptions] =
    useState(false);

  useEffect(() => {
    setCategory(subCategory);
  }, [subCategory]);

  useEffect(() => {
    let temp = [...DefaultProducts];
    console.log(temp);

    if (brand !== "") {
      temp = temp.filter((item) => item.brand === brand);
    }
    if (parseFloat(String(minPrice).replace(/,/g, "")) > 0) {
      temp = temp.filter(
        (item) => item.price >= parseFloat(String(minPrice).replace(/,/g, ""))
      );
    }
    if (
      parseFloat(maxPrice.replace(/,/g, "")) >
      parseFloat(String(minPrice).replace(/,/g, ""))
    ) {
      temp = temp.filter(
        (item) => item.price <= parseFloat(maxPrice.replace(/,/g, ""))
      );
    }
    if (seller !== "") {
      temp = temp.filter((item) => item.shop.companyName === seller);
    }
    if (showMultipleColorOptions) {
      temp = temp.filter((item) => item.colors[0].split(",").length > 1);
    }
    if (!showMultipleColorOptions) {
      temp = temp.filter((item) => item.colors[0].split(",").length >= 1);
    }
    if (showOutOfStock) {
      temp = temp.filter((item) => item.stock >= 0);
    }
    if (!showOutOfStock) {
      temp = temp.filter((item) => item.stock < 1);
    }
    temp = temp.filter((item) => item.rating >= stars);
    if (category !== "") {
      temp = temp.filter(
        (item) => item.category === category || item.subCategory === category
      );
    }

    setListProducts(temp);
  }, [
    minPrice,
    maxPrice,
    showOutOfStock,
    showMultipleColorOptions,
    brand,
    stars,
    seller,
    DefaultProducts,
    category,
    setListProducts,
  ]);

  return (
    <>
      <FilterTypeSection>
        <FilterType>Stars</FilterType>
        {[4, 3, 2, 1].map((count, index) => {
          return (
            <StarSection
              key={index}
              onClick={() => (stars === count ? setStars(0) : setStars(count))}
              style={
                stars === count
                  ? { fontWeight: "bold", color: "black" }
                  : { fontWeight: "normal", color: "var(--text-muted)" }
              }
            >
              {Array.from({ length: 5 }, (_, index) => {
                const number = index + 0.5;
                return (
                  <span key={index}>
                    {count > number ? (
                      <BsStarFill style={{ color: "rgb(255, 215, 0)" }} />
                    ) : count > index ? (
                      <BsStarHalf style={{ color: "rgb(255, 215, 0)" }} />
                    ) : (
                      <BsStar style={{ color: "rgb(255, 215, 0)" }} />
                    )}
                  </span>
                );
              })}{" "}
              & Up
            </StarSection>
          );
        })}
      </FilterTypeSection>
      <FilterTypeSection>
        <FilterType>Price</FilterType>
        <PriceRangeSection>
          <InputField
            type="text"
            placeholder="min"
            value={minPrice === "" ? 0 : minPrice}
            onChange={(e) =>
              setMinPrice(
                e.target.value
                  .replace(/\D/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              )
            }
            step="any"
          />
          <InputField
            type="text"
            placeholder="max"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                e.target.value
                  .replace(/\D/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              )
            }
            step="any"
          />
        </PriceRangeSection>
      </FilterTypeSection>
      <FilterTypeSection className="mt-3">
        <FilterType>Categories</FilterType>
        <BrandsSection>
          {Categories.map((categoryItem, index) => {
            return (
              <BrandItem
                key={index}
                onClick={() =>
                  category === categoryItem
                    ? setCategory("")
                    : setCategory(categoryItem)
                }
                style={
                  categoryItem === category
                    ? { fontWeight: "bold", color: "black" }
                    : { fontWeight: "normal", color: "var(--text-muted)" }
                }
              >
                {categoryItem}
              </BrandItem>
            );
          })}
        </BrandsSection>
      </FilterTypeSection>
      <FilterTypeSection className="mt-3">
        <FilterType>Brands</FilterType>
        <BrandsSection>
          {Brands.map((brandItem, index) => {
            return (
              <BrandItem
                key={index}
                onClick={() =>
                  brandItem === brand ? setBrand("") : setBrand(brandItem)
                }
                style={
                  brandItem === brand
                    ? { fontWeight: "bold", color: "black" }
                    : { fontWeight: "normal", color: "var(--text-muted)" }
                }
              >
                {brandItem}
              </BrandItem>
            );
          })}
        </BrandsSection>
      </FilterTypeSection>
      <FilterTypeSection className="mt-3">
        <FilterType>Sellers</FilterType>
        <BrandsSection>
          {Sellers.map((shop, index) => {
            return (
              <BrandItem
                key={index}
                onClick={() =>
                  shop === seller ? setSeller("") : setSeller(shop)
                }
                style={
                  shop === seller
                    ? { fontWeight: "bold", color: "black" }
                    : { fontWeight: "normal", color: "var(--text-muted)" }
                }
              >
                {shop}
              </BrandItem>
            );
          })}
        </BrandsSection>
      </FilterTypeSection>
      <FilterTypeSection>
        <FilterType>Color Options</FilterType>
        <OutOfStockSection>
          <input
            type="checkbox"
            checked={showMultipleColorOptions}
            onChange={() =>
              setShowMultipleColorOptions(!showMultipleColorOptions)
            }
          />
          <p style={{ marginTop: "-3px", marginLeft: "3px" }}>
            Show products with multiple color options
          </p>
        </OutOfStockSection>
      </FilterTypeSection>
      <FilterTypeSection>
        <FilterType>Out Of Stock</FilterType>{" "}
        <OutOfStockSection>
          <input
            type="checkbox"
            checked={showOutOfStock}
            onChange={() => setShowOutOfStock(!showOutOfStock)}
          />
          <p style={{ marginTop: "-3px", marginLeft: "3px" }}>
            Show out of stock products
          </p>
        </OutOfStockSection>
      </FilterTypeSection>
    </>
  );
};

export default ProductFilters;
