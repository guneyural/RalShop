import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  margin-left: 15px;
  border: 1px solid #dbdbdb;
  background: rgb(253, 253, 253);
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;

  @media (max-width: 1200px) {
    margin-left: 8px;
  }
`;
const ContainerTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dbdbdb;
  font-size: 16px;
  padding: 0px 10px;
`;
const ContainerLeft = styled.div`
  padding: 4px 10px;
  padding-bottom: 8px;
  overflow: hidden;
  max-height: 500px;
  transition: 0.5s;
  -webkit-transition: 1.1s;
  -moz-transition: 1.1s;
  transition: 1.1s;
  transition-delay: -0.1s;
`;
const Labels = styled.label`
  font-size: 14px;
`;
const InputField = styled.input`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 100%;
`;
const Select = styled.select`
  padding: 4px 5px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 100%;
`;
const InputSection = styled.div``;
const ShowOrderButton = styled.button`
  border: none;
  background: none;
  font-weight: bold;
  font-size: 15px;
  margin: 0;
  padding: 0;
  padding-left: 8px;
  &:focus {
    outline: 0;
  }
  @media (max-width: 460px) {
    font-size: 13px;
    margin-right: -10px;
  }
`;
const OutOfStockSection = styled.div`
  margin-top: 10px;
  margin-left: 15px;
  color: var(--text-muted);
  font-size: 14px;
  display: flex;

  @media (max-width: 1200px) {
    margin-left: 8px;
  }
`;

const ProductActionsFilters = ({
  listProducts,
  setListProducts,
  DefaultProducts,
}) => {
  const [sort, setSort] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [searchID, setSearchID] = useState("");
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [areFiltersVisible, setAreFiltersVisible] = useState(
    window.innerWidth < 576 ? false : true
  );

  useEffect(() => {
    if (searchID.length > 0) {
      setListProducts(listProducts.filter((item) => item._id === searchID));
    } else {
      setListProducts(DefaultProducts);
    }
  }, [searchID]);

  useEffect(() => {
    let tempCategories = new Set();
    DefaultProducts.forEach((item) => {
      tempCategories.add(item.subCategory);
    });
    setAllCategories([...tempCategories]);
  }, [DefaultProducts]);

  useEffect(() => {
    if (!showOutOfStock) {
      setListProducts(DefaultProducts);
    } else {
      setListProducts([...DefaultProducts].filter((item) => item.stock < 1));
    }
  }, [showOutOfStock]);

  useEffect(() => {
    if (category === "") {
      setListProducts(DefaultProducts);
    } else {
      setListProducts(
        [...DefaultProducts]
          .filter((item) => item.subCategory === category)
          .sort((a, b) => sortProducts(a, b))
      );
    }
  }, [category]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const regex = new RegExp(escapeRegex(searchQuery), "gi");
      setListProducts(listProducts.filter((item) => item.title.match(regex)));
    } else {
      setListProducts(
        DefaultProducts.filter((item) => item.subCategory === category)
      );
      setSort("default");
    }
  }, [searchQuery]);

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
    if (sort === "stockDesc") {
      return b.stock - a.stock;
    }
    if (sort === "stockAsc") {
      return a.stock - b.stock;
    }
    if (sort === "ratingDesc") {
      return b.rating - a.rating;
    }
    if (sort === "ratingAsc") {
      return a.rating - b.rating;
    }
  };

  let escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  useEffect(() => {
    setListProducts([...listProducts].sort((a, b) => sortProducts(a, b)));
  }, [sort]);

  return (
    <>
      <Container>
        <ContainerTop>
          <span>Filters</span>
          {!areFiltersVisible ? (
            <ShowOrderButton onMouseDown={() => setAreFiltersVisible(true)}>
              Show <MdKeyboardArrowDown style={{ fontSize: "20px" }} />
            </ShowOrderButton>
          ) : (
            <ShowOrderButton onMouseDown={() => setAreFiltersVisible(false)}>
              Hide <MdKeyboardArrowUp style={{ fontSize: "20px" }} />
            </ShowOrderButton>
          )}
        </ContainerTop>
        <ContainerLeft
          style={{
            maxHeight: areFiltersVisible ? "250px" : "0",
            padding: areFiltersVisible ? "4px 10px" : "0",
          }}
        >
          <div className="row">
            <InputSection className="col-md-3 col-sm-6">
              <Labels htmlFor="sort">Sort By</Labels>
              <br />
              <Select
                name="sort"
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="dateDesc">Date (Newest First)</option>
                <option value="dateAsc">Date (Oldest First)</option>
                <option value="priceDesc">Price (Highest First)</option>
                <option value="priceAsc">Price (Lowest First)</option>
                <option value="stockDesc">Stock (Highest First)</option>
                <option value="stockAsc">Stock (Lowest First)</option>
                <option value="ratingDesc">Rating (Highest First)</option>
                <option value="ratingAsc">Rating (Lowest First)</option>
              </Select>
            </InputSection>
            <InputSection className="col-md-3 col-sm-6">
              <Labels htmlFor="category">Category</Labels>
              <br />
              <Select
                name="category"
                id="category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                {allCategories.map((item, index) => {
                  return (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  );
                })}
              </Select>
            </InputSection>
            <InputSection className="col-md-3 col-sm-6">
              <Labels htmlFor="search">Search By Name</Labels>
              <br />
              <InputField
                type="text"
                name="search"
                id="search"
                placeholder="Search By Product Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </InputSection>
            <InputSection className="col-md-3 col-sm-6">
              <Labels htmlFor="search">Search By ID</Labels>
              <br />
              <InputField
                type="text"
                name="search"
                id="search"
                placeholder="Search By Product ID"
                value={searchID}
                onChange={(e) => setSearchID(e.target.value)}
                required
              />
            </InputSection>
          </div>
        </ContainerLeft>
      </Container>
      <OutOfStockSection>
        <input
          type="checkbox"
          checked={showOutOfStock}
          onChange={() => setShowOutOfStock(!showOutOfStock)}
        />
        <p style={{ marginTop: "-3px", marginLeft: "3px" }}>
          Show Only Out Of Stock
        </p>
      </OutOfStockSection>
    </>
  );
};
export default ProductActionsFilters;
