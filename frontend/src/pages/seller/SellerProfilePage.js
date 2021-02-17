import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import ReactMapGL, { Marker } from "react-map-gl";
import pin from "../../assets/pin.webp";
import MessageBox from "../../components/messageBox";
import { sellerLogout } from "../../redux/actions/sellerActions";

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
      <div className="col-xl-7 col-lg-6 col-md-5">
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
      <section className="col-12 mt-3">
        <h1>Links</h1>
        <SellerInformation>
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
      <button
        className="default-btn mt-5 mb-3"
        style={{ width: "100px", marginLeft: "12px" }}
        onClick={() => setIsModalOpen(true)}
      >
        Logout
      </button>
    </div>
  );
};

export default SellerProfilePage;
