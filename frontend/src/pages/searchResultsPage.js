import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import LoadingIcon from "../assets/loading.gif";
import axios from "axios";
import styled from "styled-components";
import ListProducts from "../components/listProducts";
import ProductFilters from "../components/ProductFilters";
import { BsFilterRight } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

const ResultsCountSection = styled.div`
  border-bottom: 1px solid #dbdbdb;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 5px;
`;
const ResultsCount = styled.span`
  font-weight: bold !important;
  font-size: 15px !important;

  @media (max-width: 612px) {
    display: none;
  }
`;
const Select = styled.select`
  padding: 4px 5px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
`;
const SpanText = styled.span`
  @media (max-width: 612px) {
    display: none;
  }
`;
const ProductsContainer = styled.div`
  margin-top: 15px;
`;
const FilterButton = styled.button`
  display: none;

  &:focus {
    outline: 0;
  }
`;
const FiltersSection = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 100px;
  z-index: 1;

  @media (max-width: 767px) {
    position: static;
    z-index: 0;
    top: 0;

    ${FilterButton} {
      display: block;
    }
  }
`;
const CloseButton = styled.button`
  display: none;
  user-select: none;
  border-radius: 50%;
  border: none;
  background: none;
  transition: 0.3s;
  position: relative;
  left: -5px;
  font-size: 22px;

  &:focus {
    outline: 0;
  }

  &:hover {
    background: #dbdbdb;
  }
`;
const MobileSeperator = styled.div`
  display: none;
  padding: 0;
  margin: 0;
  @media (max-width: 767px) {
    display: block;
  }
`;
const FilterHeader = styled.span`
  font-weight: bold;
  font-size: 20px;
`;
const DesktopFilterSection = styled.div`
  transition: 0.5s;

  @media (max-width: 767px) {
    ${CloseButton} {
      display: block;
    }

    position: fixed;
    top: 0;
    left: 0;
    background: white;
    border-left: 1px solid #dbdbdb;
    width: 0;
    z-index: 99999;
    height: 100vh;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const SearchResultsPage = () => {
  const history = useHistory();
  const { query, brand } = useParams();
  const [products, setProducts] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sellers, SetSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("default");
  const [isFiltersSectionOpen, setIsFiltersSectionOpen] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const getWidth = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", getWidth);

    return () => {
      window.removeEventListener("resize", getWidth);
    };
  }, [windowSize]);

  useEffect(() => {
    setIsLoading(true);
    let brandSet = new Set();
    let sellerSet = new Set();
    axios
      .get(`/api/product/search/${query}`)
      .then((res) => res.data)
      .then((data) => {
        setIsLoading(false);
        setProducts(data.products);
        setListProducts(data.products);
        data.products.forEach((item) => {
          brandSet.add(item.brand);
          sellerSet.add(item.shop.companyName);
        });
        setBrands([...brandSet]);
        SetSellers([...sellerSet]);
        if (data.products.length < 1) {
          setProducts(data.brands);
          setListProducts(data.brands);
        }
      });
  }, [query]);

  useEffect(() => {
    setListProducts([...listProducts].sort((a, b) => sortProducts(a, b)));
  }, [sort]);

  let sortProducts = (a, b) => {
    if (sort === "dateDesc" || sort === "default") {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
    if (sort === "dateAsc") {
      return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    }
    if (sort === "priceDesc") {
      return b.price - a.price;
    }
    if (sort === "priceAsc") {
      return a.price - b.price;
    }
    if (sort === "ratingDesc") {
      return b.rating - a.rating;
    }
    if (sort === "ratingAsc") {
      return a.rating - b.rating;
    }
    if (sort === "wishlistDesc") {
      return b.wishlistCount - a.wishlistCount;
    }
    if (sort === "wishlistAsc") {
      return a.wishlistCount - b.wishlistCount;
    }
    if (sort === "ordersDesc") {
      return b.ordersCount - a.ordersCount;
    }
    if (sort === "ordersAsc") {
      return a.ordersCount - b.ordersCount;
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <img src={LoadingIcon} alt="loading spinner" height="120" width="120" />
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-3 mb-3">
          <FiltersSection>
            <DesktopFilterSection
              style={
                windowSize < 768
                  ? isFiltersSectionOpen
                    ? {
                        padding: "10px 15px",
                        width: "55%",
                        borderRight: "1px solid #dbdbdb",
                      }
                    : { padding: "0", width: "0", borderRight: "0" }
                  : { padding: "3px", width: "auto" }
              }
            >
              <section style={{ display: "flex", alignItems: "center" }}>
                <CloseButton onClick={() => setIsFiltersSectionOpen(false)}>
                  <FaTimes />
                </CloseButton>
                <FilterHeader>Filters</FilterHeader>
              </section>
              <MobileSeperator>
                <hr style={{ margin: "8px 0", padding: "0" }} />
              </MobileSeperator>
              <ProductFilters
                DefaultProducts={products}
                ListProducts={listProducts}
                Brands={brands}
                Sellers={sellers}
                setListProducts={setListProducts}
                Brand={brand}
              />
            </DesktopFilterSection>
            <FilterButton
              className="default-btn"
              onClick={() =>
                isFiltersSectionOpen
                  ? setIsFiltersSectionOpen(false)
                  : setIsFiltersSectionOpen(true)
              }
            >
              <BsFilterRight style={{ fontWeight: "bold" }} /> Filters
            </FilterButton>
          </FiltersSection>
        </div>
        <div className="col-md-9">
          <ResultsCountSection>
            <span>
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                {products.length}
              </span>{" "}
              results found <SpanText>for </SpanText>
              <ResultsCount>"{query}"</ResultsCount>
            </span>
            <Select
              name="sort"
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="dateDesc">Date (Newest First)</option>
              <option value="dateAsc">Date (Oldest First)</option>
              <option value="priceDesc">Price (Highest First)</option>
              <option value="priceAsc">Price (Lowest First)</option>
              <option value="ratingDesc">Rating (Highest First)</option>
              <option value="ratingAsc">Rating (Lowest First)</option>
            </Select>
          </ResultsCountSection>
          <ProductsContainer>
            {listProducts.length < 1 ? (
              <div style={{ textAlign: "center" }}>
                <h2>No Results Found For</h2>
                <p className="lead">"{query}"</p>
              </div>
            ) : (
              <ListProducts
                DefaultProducts={products}
                ListedProducts={listProducts}
              />
            )}
          </ProductsContainer>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
