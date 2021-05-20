import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { categories } from "../data/category";
import { countries } from "../data/countries";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import LoadingIcon from "../assets/loading.gif";
import { sellerUpdateProfile } from "../redux/actions/sellerActions";

const FullPageBackground = styled.div`
  position: fixed;
  z-index: 99999999;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
`;
const ModalBox = styled.div`
  background: white;
  border-radius: 3px;
  border: 1.3px solid #dbdbdb;
  width: 60%;
  overflow-x: hidden;
  overflow-y: auto;
  height: 500px;
  max-height: 90%;
  &::-webkit-scrollbar {
    width: 6px;
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
  @media (max-width: 800px) {
    width: 70%;
  }
  @media (max-width: 550px) {
    width: 90%;
  }
  @media (max-width: 430px) {
    width: 100%;
  }
`;
const ModalBoxTop = styled.div`
  padding: 3px 8px;
  border-bottom: 1.3px solid #dbdbdb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  transition: 0.3s;
  &:focus {
    outline: 0;
  }
  &:hover {
    background: #dedede;
  }
`;
const ModalBoxTitle = styled.h5`
  font-weight: bold;
  margin: 0;
  padding: 0;
  margin-top: 2px;
`;
const ModalBoxInner = styled.div`
  padding: 3px 8px;
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
  width: 95%;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
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
const InputFieldFullWidth = styled.input`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 95%;

  &:focus {
    outline: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const SearchResultsBox = styled.div`
  width: 95%;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const SellerProfileEdit = ({ isModalOpen, Seller }) => {
  const [category, setCategory] = useState(Seller.category);
  const [companyName, setCompanyName] = useState(Seller.companyName);
  const [center, setCenter] = useState(Seller.coordinate);
  const [country, setCountry] = useState(Seller.country);
  const [email, setEmail] = useState(Seller.email);
  const [fullname, setFullname] = useState(Seller.fullname);
  const [location, setLocation] = useState(Seller.location);
  const [links, setLinks] = useState(Seller.links.join("            "));
  const [phoneNumber, setPhoneNumber] = useState(Seller.phoneNumber);
  const [sellerId, setSellerId] = useState(Seller.id);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.Seller);
  const lastAction = useSelector((state) => state.lastAction);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => setIsEdited(false), []);
  useEffect(() => {
    if (location.length > 0) {
      if (results.length > 0) {
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
    window.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && isModalOpen(false)
    );
  }, [isModalOpen]);

  useEffect(() => {
    if (isEdited && lastAction === "UPDATE_SELLER") {
      isModalOpen(false);
    }
  }, [lastAction, isModalOpen, isEdited]);

  const editProfile = (e) => {
    e.preventDefault();
    let data = {
      fullname,
      email,
      country,
      phoneNumber,
      category,
      companyName,
      location,
      coordinate: center,
      links: links.split(" ").filter((e) => e !== ""),
    };

    dispatch(sellerUpdateProfile(data, sellerId));
    setIsEdited(true);
  };
  const changeLocation = (placeName, coordinate) => {
    setLocation(placeName);
    setCenter(coordinate);
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
    <FullPageBackground>
      <ModalBox>
        <ModalBoxTop>
          <ModalBoxTitle>Edit Your Profile</ModalBoxTitle>
          <CloseButton onClick={() => isModalOpen(false)}>
            <FaTimes />
          </CloseButton>
        </ModalBoxTop>
        <ModalBoxInner>
          <form onSubmit={(e) => editProfile(e)}>
            <div className="row">
              <div className="col-md-6 mt-2">
                <Labels htmlFor="fullname">Fullname</Labels>
                <br />
                <InputField
                  type="text"
                  placeholder="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mt-2">
                <Labels htmlFor="email">Email</Labels>
                <br />
                <InputField
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mt-2">
                <Labels htmlFor="phonenumber">Phone Number</Labels>
                <br />
                <InputField
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mt-2">
                <Labels htmlFor="fullname">Company Name</Labels>
                <br />
                <InputField
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mt-2">
                <Labels htmlFor="category">Category</Labels>
                <br />
                <Select
                  name="category"
                  id="category"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  required
                >
                  <option value="">Category</option>
                  {categories.map((item, idx) => {
                    return (
                      <option value={item} key={idx}>
                        {item}
                      </option>
                    );
                  })}
                </Select>
              </div>
              <div className="col-md-6 mt-2">
                <Labels htmlFor="category">Country</Labels>
                <br />
                <Select
                  name="country"
                  id="country"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  required
                >
                  <option value="">Country</option>
                  {countries.map((item, idx) => {
                    return (
                      <option value={item.code} key={idx}>
                        {item.name}
                      </option>
                    );
                  })}
                </Select>
              </div>
              <div className="col-12 mt-3">
                <div className="form-section">
                  <Labels htmlFor="location">Location</Labels>
                  <InputFieldFullWidth
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
                  <SearchResultsBox className="location-search-results">
                    {isLoading ? (
                      "Loading..."
                    ) : (
                      <div>
                        {results.map((item, idx) => {
                          return (
                            <section
                              className="location-result mb-1"
                              key={idx}
                              onMouseDown={() =>
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
                  </SearchResultsBox>
                  <div className="form-text">
                    Enter headquarters of your company
                  </div>
                  <div className="form-text text-danger">
                    {notFound && "No address found"}
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3" style={{ marginTop: "-5px" }}>
                <Labels htmlFor="links">
                  Enter The Links Of Your Shop If You Have
                </Labels>
                <TextField
                  name="links"
                  id="links"
                  cols="10"
                  rows="5"
                  style={{ color: "#0d6efd" }}
                  placeholder="If you sell products on different websites or if your company have website, enter links of them. Seperate links with space. If you don't have link to enter leave it blank."
                  onChange={(e) => setLinks(e.target.value)}
                >
                  {links}
                </TextField>
              </div>
            </div>
            <section className="d-flex align-items-center">
              <button className="default-btn mb-3 mt-3">Edit</button>
              {loading && (
                <img
                  src={LoadingIcon}
                  alt="loading spinner"
                  height="50px"
                  width="50px"
                  className="d-block"
                />
              )}
              {error.message && (
                <span style={{ paddingLeft: "20px" }} className="text-danger">
                  {error.message}
                </span>
              )}
            </section>
          </form>
        </ModalBoxInner>
      </ModalBox>
    </FullPageBackground>
  );
};

export default SellerProfileEdit;
