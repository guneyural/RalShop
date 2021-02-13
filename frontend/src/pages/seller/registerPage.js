import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import RegisterPhoto from "../../assets/registerPhoto.svg";
import { categories } from "../../data/category";
import { countries } from "../../data/countries";
import mapboxgl from "mapbox-gl";
import axios from "axios";

const PageHeader = styled.h1`
  font-weight: 300;
  text-align: center;
`;
const BrandName = styled.h1`
  font-weight: 300;
  font-size: 42px;
`;

const Muted = styled.span`
  color: var(--text-muted);
`;
const Labels = styled.label`
  font-weight: 500;
`;
const InputField = styled.input`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 90%;

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

const RegisterPage = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [links, setLinks] = useState("");
  const [password, setPassword] = useState("");
  const [map, setMap] = useState(null);
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(null);
  const [center, setCenter] = useState([35, 39]);
  const mapContainer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const changeLocation = (placeName, coordinate) => {
    setLocation(placeName);
    setCenter(coordinate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      fullname,
      email,
      country,
      phoneNumber,
      category,
      companyName,
      location,
      links,
      password,
    });
  };

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

  return (
    <div>
      <PageHeader>Register As Seller</PageHeader>
      <hr />
      <div className="row">
        <div className="col-md-8">
          <p style={{ marginTop: "-10px" }}>Become a seller in UralShop</p>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-section">
                  <Labels htmlFor="fullname">Fullname</Labels>
                  <InputField
                    type="text"
                    name="fullname"
                    id="fullname"
                    aria-label="fullname"
                    placeholder="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>
                <div className="form-section">
                  <Labels htmlFor="email">Email</Labels>
                  <InputField
                    type="email"
                    name="email"
                    id="email"
                    aria-label="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-section">
                  <Labels htmlFor="country">Country</Labels>
                  <Select
                    name="country"
                    id="country"
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value="">Select Your Country</option>
                    {countries.map((item, idx) => {
                      return (
                        <option
                          value={item.code}
                          key={idx}
                        >{`${item.code} - ${item.name}`}</option>
                      );
                    })}
                  </Select>
                </div>
                <div className="form-section">
                  <Labels htmlFor="category">Category</Labels>
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
                  <div className="form-text">Select your main category</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-section">
                  <Labels htmlFor="phonenumber">Phone Number</Labels>
                  <InputField
                    type="text"
                    name="phonenumber"
                    id="phonenumber"
                    aria-label="phonenumber"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <div className="form-text">Enter company phone number</div>
                </div>
                <div className="form-section">
                  <Labels htmlFor="companyName">Company Name</Labels>
                  <InputField
                    type="text"
                    name="companyName"
                    id="companyName"
                    aria-label="company name"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-section">
                  <Labels htmlFor="location">Location</Labels>
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
                  <div className="location-search-results">
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
                  <div className="form-text">
                    Enter headquarters of your company
                  </div>
                  <div className="form-text text-danger">
                    {notFound && "No address found"}
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={(el) => (mapContainer.current = el)}
              style={{ height: "300px" }}
            />
            <Labels htmlFor="links" className="mt-4">
              Enter The Links Of Your Shop If You Have
            </Labels>
            <div className="form-section">
              <TextField
                name="links"
                id="links"
                cols="10"
                rows="5"
                style={{ color: "#0d6efd", textDecoration: "underline" }}
                placeholder="If you sell products on different websites or if your company have website, enter links of them. Seperate links with space. If you don't have link to enter leave it blank."
                onChange={(e) => setLinks(e.target.value)}
              >
                {links}
              </TextField>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-section">
                  <Labels htmlFor="password">Password</Labels>
                  <InputField
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="default-btn seller">
                  Register As Seller
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <img
            src={RegisterPhoto}
            alt="online shopping"
            style={{ width: "100%" }}
          />
          <section style={{ textAlign: "center" }}>
            <BrandName>UralShop</BrandName>
            <Muted>Güney Ural @ 2021</Muted>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
