import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import ReactMapGL, { Marker } from "react-map-gl";
import pin from "../../assets/pin.webp";
import MessageBox from "../../components/messageBox";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import { sellerLogout } from "../../redux/actions/sellerActions";
import { AiFillEdit } from "react-icons/ai";
import { RiLogoutBoxFill } from "react-icons/ri";
import SellerProfileEdit from "../../components/sellerProfileEdit";

const SellerInformation = styled.div`
  border: 1px solid #c2c2c2;
  background: white;
  border-radius: 4px;
`;
const InformationColumn = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 15px;
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;
const TableSection = styled.section`
  background: #cecece;
  padding: 5px 10px;
  width: 160px;
  text-align: center;
  font-weight: 500;

  @media (max-width: 500px) {
    width: 120px;
  }
`;
const TableData = styled.span`
  margin: auto;
`;
const Underline = styled.hr`
  margin: 0;
`;

const SellerProfilePage = () => {
  const Seller = useSelector((state) => state.Seller);
  const [center, setCenter] = useState([...Seller.shop.coordinate]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewport, setViewport] = useState({
    height: 205,
    latitude: center[1],
    longitude: center[0],
    zoom: 10,
  });

  useEffect(() => {
    setCenter(Seller.shop.coordinate);
  }, [Seller, center]);

  return (
    <div className="row">
      {isEditModalOpen && (
        <SellerProfileEdit
          isModalOpen={setIsEditModalOpen}
          Seller={Seller.shop}
        />
      )}
      {isModalOpen && (
        <MessageBox
          action={sellerLogout}
          message={"Do You Want To Logout?"}
          header={"Logout"}
          setIsModalOpen={setIsModalOpen}
          btnText={"Logout"}
          isModalOpen={isModalOpen}
          isRedux={true}
        />
      )}
      <div className="col-xl-5 col-lg-6 col-md-7">
        <h2>Seller Information</h2>
        <SellerInformation>
          <InformationColumn>
            <TableSection>
              <span>Full Name</span>
            </TableSection>
            <TableData>{Seller.shop.fullname}</TableData>
          </InformationColumn>
          <Underline />
          <InformationColumn>
            <TableSection>Company Name</TableSection>
            <TableData>{Seller.shop.companyName}</TableData>
          </InformationColumn>
          <Underline />
          <InformationColumn>
            <TableSection>Email</TableSection>
            <TableData>{Seller.shop.email}</TableData>
          </InformationColumn>
          <Underline />
          <InformationColumn>
            <TableSection>Phone Number</TableSection>
            <TableData>{Seller.shop.phoneNumber}</TableData>
          </InformationColumn>
          <Underline />
          <InformationColumn>
            <TableSection>Country</TableSection>
            <TableData>{Seller.shop.country}</TableData>
          </InformationColumn>
          <Underline />
          <InformationColumn>
            <TableSection>Category</TableSection>
            <TableData style={{ textTransform: "capitalize" }}>
              {Seller.shop.category}
            </TableData>
          </InformationColumn>
          <Underline />
          <InformationColumn>
            <TableSection>Seller Since</TableSection>
            <TableData>{moment(Seller.shop.createdAt).format("ll")}</TableData>
          </InformationColumn>
        </SellerInformation>
      </div>
      <div className="col-xl-7 col-lg-6 col-md-5 ">
        <h2>Location</h2>
        <SellerInformation>
          <InformationColumn>
            <span style={{ margin: "auto", fontWeight: "500" }}>
              {Seller.shop.location}
            </span>
          </InformationColumn>
        </SellerInformation>
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
      </div>
      <section className="col-md-4 mt-4">
        <h2>Links</h2>
        <SellerInformation>
          {Seller.shop.links.length < 1 && <p>No Links Added</p>}
          {Seller.shop.links.map((item, idx) => {
            return (
              <>
                <InformationColumn>
                  <a
                    href={item}
                    style={{
                      margin: "0 auto",
                      fontSize: "15px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    {item.split("/")[2]}
                  </a>
                </InformationColumn>
                {idx !== Seller.shop.links.length - 1 && <Underline />}
              </>
            );
          })}
        </SellerInformation>
      </section>
      <section className="col-md-4 mt-4">
        <h2>Rating</h2>
        <section
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "28px",
            marginTop: "-15px",
          }}
        >
          <p style={{ position: "relative", top: "12px" }}>
            {Seller.shop.rating}{" "}
            <b style={{ position: "relative", bottom: "3px" }}>-</b>
          </p>
          <section style={{ marginLeft: "10px" }}>
            {Array.from({ length: 5 }, (_, index) => {
              const number = index + 0.5;
              return (
                <span key={index}>
                  {Seller.shop.rating > number ? (
                    <BsStarFill style={{ color: "rgb(255, 215, 0)" }} />
                  ) : Seller.shop.rating > index ? (
                    <BsStarHalf style={{ color: "rgb(255, 215, 0)" }} />
                  ) : (
                    <BsStar style={{ color: "rgb(255, 215, 0)" }} />
                  )}
                </span>
              );
            })}
          </section>
        </section>
        <p
          style={{
            padding: "0",
            margin: "0",
            marginTop: "-5px",
            fontSize: "15px",
            color: "var(--text-muted)",
          }}
        >
          ({Seller.shop.ratingCount > 0 ? `${Seller.shop.ratingCount} ` : "No "}
          reviews)
        </p>
      </section>
      <section
        className="col-md-4 mt-4"
        style={{ textAlign: "center", margin: "auto" }}
      >
        <section style={{ textAlign: "left" }}>
          <h2>Settings</h2>
          <p
            style={{
              borderBottom: "1px solid #dbdbdb",
              margin: "0",
              cursor: "pointer",
              paddingBottom: "8px",
            }}
            onClick={() => setIsEditModalOpen(true)}
          >
            <AiFillEdit /> Edit Profile
          </p>
          <p
            style={{
              paddingTop: "10px",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <RiLogoutBoxFill /> Logout
          </p>
        </section>
      </section>
    </div>
  );
};

export default SellerProfilePage;
