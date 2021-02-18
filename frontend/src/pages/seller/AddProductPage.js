import React, { useState, useEffect, useRef } from "react";
import { categories, subCategories } from "../../data/category";
import LoadingIcon from "../../assets/loading.gif";
import styled from "styled-components";
import { CompactPicker } from "react-color";
import JoditEditor from "jodit-react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { priceConverter } from "../../utils/helpers";

const PageHeader = styled.h1`
  font-weight: 300;
  text-align: center;
`;
const Labels = styled.label`
  font-weight: 500;
`;
const InputField = styled.input`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const TextField = styled.textarea`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
`;
const Select = styled.select`
  padding: 4px 5px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 90%;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const RemoveIcon = styled.span`
  color: white;
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  bottom: -6px;
  left: 3px;
  text-shadow: -1px -1px black;
  visibility: hidden;
`;
const ColorPreview = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  margin: 1px;
  border: 1px solid black;
  position: relative;
  &:hover {
    ${RemoveIcon} {
      visibility: visible;
    }
  }
`;

const ColorOptions = styled.div`
  margin-left: 20px;
  @media (max-width: 512px) {
    margin-left: 0;
  }
`;

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [colors, setColors] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("");
  const editor = useRef(null);
  const [map, setMap] = useState(null);
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(null);
  const [center, setCenter] = useState([35, 39]);
  const mapContainer = useRef(null);
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stock, setStock] = useState(0);
  const config = {
    readonly: false,
  };

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center,
        zoom: 5,
      });
      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) {
      initializeMap({ setMap, mapContainer });
    }

    if (map !== null && location.length > 0) {
      map.flyTo({
        center,
        essential: true,
        zoom: 12,
      });
    }
  }, [map, center]);

  useEffect(() => {
    if (location.length > 0) {
      if (results !== []) {
        document
          .querySelector(".location-search-results")
          .classList.add("active");
      }
    } else {
      document
        .querySelector(".location-search-results")
        .classList.remove("active");
    }
    if (notFound) {
      setIsLoading(false);
      document
        .querySelector(".location-search-results")
        .classList.remove("active");
    }
  }, [location, results, notFound]);

  const displayResults = () => {
    if (notFound !== null && notFound === false)
      document
        .querySelector(".location-search-results")
        .classList.add("active");
  };

  const removeResults = () => {
    setTimeout(() => {
      document
        .querySelector(".location-search-results")
        .classList.remove("active");
    }, 100);
  };

  const changeLocation = (placeName, coordinate) => {
    setLocation(placeName);
    setCenter(coordinate);
  };

  const searchAddress = (e) => {
    setLocation(e.target.value);
    setIsLoading(true);
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      )
      .then((res) => res.data)
      .then((data) => {
        setResults(data.features);
        setIsLoading(false);
        setNotFound(false);
      })
      .catch((err) => {
        setResults([]);
        setNotFound(true);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    const imageFile = document.querySelector(`input[type='file']`);
    if (imageFile.files) {
      for (let i = 0; i < imageFile.files.length; i++) {
        formData.append("images", imageFile.files[i]);
      }
    }
    formData.append("title", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("brand", brand);
    formData.append("colors", colors);
    formData.append("location", location);
    formData.append("center", center);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
  };

  const handleChangeComplete = (color) => {
    setColor(color.hex);
    setColors((oldColors) => {
      if (colors.indexOf(color.hex) === -1) {
        return [color.hex, ...oldColors];
      } else {
        return [...oldColors];
      }
    });
  };

  const removeColor = (clr) => {
    setColors(colors.filter((item) => item !== clr));
  };

  return (
    <div>
      <PageHeader>Add Product</PageHeader>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="form-section">
          <Labels htmlFor="name">Product Name</Labels>
          <InputField
            type="text"
            name="name"
            id="name"
            placeholder="Product Name"
            onBlur={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="row mt-3">
          <div className="col-md-4 mb-3">
            <Labels htmlFor="category">Select Category</Labels>
            <Select
              name="category"
              id="category"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((item, idx) => {
                return (
                  <option value={item} key={idx}>
                    {item}
                  </option>
                );
              })}
            </Select>
          </div>
          <div className="col-md-4">
            <div className="form-section">
              <Labels htmlFor="subCategory">Select Sub Category</Labels>
              <Select
                name="subCategory"
                id="subCategory"
                onChange={(e) => setSubCategory(e.target.value)}
                required
              >
                <option value="">Select Sub Category</option>
                {category !== "" &&
                  subCategories[categories.indexOf(category)].map(
                    (item, idx) => {
                      return (
                        <option value={item} key={idx}>
                          {item}
                        </option>
                      );
                    }
                  )}
              </Select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-section">
              <Labels htmlFor="stock">Stock</Labels>
              <InputField
                id="stock"
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-section">
              <Labels htmlFor="brand">Brand Name</Labels>
              <InputField
                type="text"
                name="brand"
                id="brand"
                placeholder="Brand Name"
                onBlur={(e) => setBrand(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-section">
              <Labels htmlFor="price">Price ({priceConverter(price)})</Labels>
              <InputField
                id="price"
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div>
            <Labels htmlFor="colorPicker">
              Pick Color Options For Product
            </Labels>
            <br />
            <span className="form-text" style={{ marginTop: "-5px" }}>
              Picked colors will be displayed on right.
            </span>
            <br />
            <CompactPicker
              id="colorPicker"
              color={color}
              onChange={(color) => handleChangeComplete(color)}
            />
          </div>
          <ColorOptions>
            <p style={{ fontWeight: "500" }}>Picked Colors:</p>
            <span
              style={{ marginTop: "-15px", display: "block" }}
              className="form-text"
            >
              Colors gets removed on click
            </span>
            <br />
            {colors.length > 0 &&
              colors.map((clr, idx) => {
                return (
                  <ColorPreview
                    style={{ background: clr }}
                    onClick={() => removeColor(clr)}
                    key={idx}
                    id={`clr${clr.substring(1, clr.length)}`}
                  >
                    <RemoveIcon>&times;</RemoveIcon>
                  </ColorPreview>
                );
              })}
          </ColorOptions>
        </div>
        <Labels htmlFor="description" className="mt-5">
          Description
        </Labels>
        <JoditEditor
          id="description"
          ref={editor}
          value={description}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setDescription(newContent.target.innerHTML)}
        />
        <Labels htmlFor="images" className="mt-3">
          Choose Product Images
        </Labels>
        <input className="form-control" type="file" id="images" multiple />
        <div className="form-section mt-3">
          <Labels htmlFor="location">Enter Location Of Product</Labels>
          <InputField
            type="text"
            name="location"
            id="location"
            aria-label="location"
            placeholder="Location"
            value={location}
            onFocus={() => displayResults()}
            onChange={(e) => searchAddress(e)}
            onBlur={() => removeResults()}
            autoComplete="off"
            required
          />
          <div className="location-search-results w-100">
            {isLoading ? (
              "Loading..."
            ) : (
              <div>
                {results.map((item, idx) => {
                  return (
                    <section
                      className="location-result mb-1"
                      key={idx}
                      onClick={() =>
                        changeLocation(
                          item.place_name,
                          item.geometry.coordinates
                        )
                      }
                    >
                      <span>{item.text}</span>
                      <br />
                      <span style={{ fontSize: "13px" }}>
                        {`${item.place_name.substring(0, 32)}...`}
                      </span>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
          <div className="form-text text-danger">
            {notFound && "No address found"}
          </div>
          <div
            ref={(el) => (mapContainer.current = el)}
            style={{ height: "300px" }}
          />
        </div>
        <button className="default-btn mt-4">Create Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
