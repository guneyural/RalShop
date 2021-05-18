import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { createChatroom } from "../redux/actions/chatActions";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import ReactMapGL, { Marker } from "react-map-gl";
import pin from "../assets/pin.webp";
import moment from "moment";

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
  max-height: 70%;
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
  @media (max-width: 768px) {
    width: 80%;
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
const AddressBox = styled.div`
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  margin: 15px 0px;
  margin-top: 5px;
  width: 100%;
  box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  -webkit-box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  -moz-box-shadow: 0px 0px 7px 1px rgba(223, 223, 223, 0.49);
  overflow: hidden;
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
`;
const AddressBoxTop = styled.div`
  border-bottom: 1px solid #dbdbdb;
  margin: 0;
  padding: 5px 10px;
  background: #efefef;
  display: flex;
  justify-content: space-between;
`;
const AddressBoxInner = styled.div`
  padding: 5px 10px;
  font-size: 15px;
  word-wrap: break-word;
  whitespace: pre-wrap;
  overflow: hidden;
`;
const InnerItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: var(--text-muted);
  align-items: center;
  padding-top: 3px;
`;

const SellerDetailsModal = ({ Seller, closeModal }) => {
  const dispatch = useDispatch();
  const { inSellerRoute } = useSelector((state) => state.Seller);
  const history = useHistory();
  const [center, setCenter] = useState([...Seller.coordinate]);
  const [viewport, setViewport] = useState({
    height: 205,
    latitude: center[1],
    longitude: center[0],
    zoom: 11,
  });

  useEffect(() => {
    window.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && closeModal(false)
    );
  }, [closeModal]);

  useEffect(() => {
    setCenter(Seller.coordinate);
    console.log(Seller);
  }, [Seller]);

  const communicateSeller = () => {
    dispatch(createChatroom(Seller._id, inSellerRoute));
    history.push("/chat");
  };

  return (
    <FullPageBackground>
      <ModalBox>
        <ModalBoxTop>
          <ModalBoxTitle>Seller Details</ModalBoxTitle>
          <CloseButton onClick={() => closeModal(false)}>
            <FaTimes />
          </CloseButton>
        </ModalBoxTop>
        <ModalBoxInner>
          <div className="row">
            <div className="col-md-12">
              <AddressBox>
                <AddressBoxTop>
                  <b>{Seller.companyName}</b>
                  <span
                    onClick={() => communicateSeller()}
                    style={{ cursor: "pointer" }}
                  >
                    Send Message To Seller
                  </span>
                </AddressBoxTop>
                <AddressBoxInner>
                  <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                    <>Name</>
                    <b style={{ color: "#333" }}>{Seller.fullname}</b>
                  </InnerItem>
                  <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                    <>Company</>
                    <b style={{ color: "#333" }}>{Seller.companyName}</b>
                  </InnerItem>
                  <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                    <>E-Mail</>
                    <b style={{ color: "#333" }}>{Seller.email}</b>
                  </InnerItem>
                  <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                    <>Phone</>
                    <b style={{ color: "#333" }}>{Seller.phoneNumber}</b>
                  </InnerItem>
                  <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                    <>Category</>
                    <b style={{ color: "#333" }}>{Seller.category}</b>
                  </InnerItem>
                  <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                    <>Country</>
                    <b style={{ color: "#333" }}>{Seller.country}</b>
                  </InnerItem>
                  <InnerItem style={{ borderBottom: "1px solid #dbdbdb" }}>
                    <>Seller Since</>
                    <b style={{ color: "#333" }}>
                      {moment(Seller.createdAt).format("ll")}
                    </b>
                  </InnerItem>
                  <InnerItem style={{}}>
                    <>Rating</>
                    <b style={{ color: "#333" }}>{Seller.rating}</b>
                  </InnerItem>
                </AddressBoxInner>
              </AddressBox>
            </div>
            <div className="col-md-7">
              <AddressBox>
                <AddressBoxTop style={{ fontSize: "14px" }}>
                  {Seller.location}
                </AddressBoxTop>
                <ReactMapGL
                  {...viewport}
                  width={"100%"}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                  onViewportChange={(nextViewport) => setViewport(nextViewport)}
                >
                  <Marker latitude={center[1]} longitude={center[0]}>
                    <button
                      style={{
                        border: "transparent",
                        background: "transparent",
                        cursor: "pointer",
                        transform: `translate(${-30 / 2}px,${-30}px)`,
                      }}
                    >
                      <img src={pin} alt="map pin" height="30" width="30" />
                    </button>
                  </Marker>
                </ReactMapGL>
              </AddressBox>
            </div>
            <div className="col-md-5">
              <AddressBox>
                <AddressBoxTop>
                  <b>Links Related To Seller</b>
                </AddressBoxTop>
                <AddressBoxInner>
                  {Seller.links.length > 0
                    ? Seller.links.map((link, index) => {
                        return (
                          <InnerItem
                            key={index}
                            style={
                              Seller.links.length - 1 === index
                                ? {}
                                : { borderBottom: "1px solid #dbdbdb" }
                            }
                          >
                            <Link
                              to={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "block",
                                textAlign: "center",
                                textDecoration: "none",
                                margin: "auto",
                              }}
                            >
                              {link.split("/")[2]}
                            </Link>
                          </InnerItem>
                        );
                      })
                    : "No link available"}
                </AddressBoxInner>
              </AddressBox>
            </div>
          </div>
        </ModalBoxInner>
      </ModalBox>
    </FullPageBackground>
  );
};

export default SellerDetailsModal;
