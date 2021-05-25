import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";

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
  DefaultProducts,
  ListedProducts,
  Brands,
  Sellers,
}) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [showMultipleColorOptions, setShowMultipleColorOptions] =
    useState(true);

  return (
    <>
      <FilterTypeSection>
        <FilterType>Stars</FilterType>
        {[4, 3, 2, 1].map((count, index) => {
          return (
            <StarSection key={index}>
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
            value={minPrice}
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
        <FilterType>Brands</FilterType>
        <BrandsSection>
          {Brands.map((brand, index) => {
            return <BrandItem key={index}>{brand}</BrandItem>;
          })}
        </BrandsSection>
      </FilterTypeSection>
      <FilterTypeSection className="mt-3">
        <FilterType>Sellers</FilterType>
        <BrandsSection>
          {Sellers.map((seller, index) => {
            return <BrandItem key={index}>{seller}</BrandItem>;
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
