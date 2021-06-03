import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import { MdLocationOn, MdPerson } from "react-icons/md";
import { BiLogOut, BiRightArrowAlt, BiMoney } from "react-icons/bi";
import { BsGraphUp } from "react-icons/bs";
import { FaUserPlus, FaShoppingCart } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import LoadingIcon from "../../assets/loading.gif";
import Modal from "../messageBox";
import { sellerLogout } from "../../redux/actions/sellerActions";
import { priceConverter } from "../../utils/helpers";

const BoxTop = styled.div`
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const BoxHeader = styled.h5`
  @media (max-width: 576px) {
    font-size: 17px !important;
  }

  @media (max-width: 372px) {
    font-size: 16px !important;
  }
`;
const IconBox = styled.div`
  background: #333;
  color: white;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  font-size: 17px;
  display: flex;
  justify-content: center;
  margin-top: -8px;
  align-items: center;
`;
const RevenueBox = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 8px;
  position: relative;
  height: 165px;
  margin-top: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
  height: 120px;
`;
const ProductBox = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 8px;
  position: relative;
  height: 165px;
  margin-top: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
  height: 120px;
`;
const ProfileBox = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 8px;
  position: relative;
  display: flex;

  overflow: hidden;
  height: 165px;

  @media (max-width: 460px) {
    width: 100%;
  }
`;
const RatingBox = styled.div`
  height: 90px;
  width: 90px;
  border: 5px solid rgb(255, 215, 0);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
  margin: auto;
`;
const ProfileBoxRatingSection = styled.div`
  position: relative;
  top: 0px;
  left: 0;
  width: 110px;
`;
const ReviewCount = styled.p`
  margin: 0;
  margin-top: 3px;
  font-size: 15px;
  text-align: center;
`;
const IncreaseText = styled.p`
  margin: 0;
  margin-top: -8px;
  font-size: 15px;
`;

const SellerHomePageSections = () => {
  const { shop } = useSelector((state) => state.Seller);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && (
        <Modal
          isRedux={true}
          action={sellerLogout}
          message={"Do you want to logout?"}
          setIsModalOpen={setIsModalOpen}
          header={"Log out"}
          btnText={"Log out"}
        />
      )}
      <div className="row">
        {shop !== null ? (
          <>
            <div className="col-lg-6 col-md-8 col-sm-8 m-auto col-12">
              <ProfileBox>
                {shop !== null ? (
                  <>
                    <ProfileBoxRatingSection>
                      <RatingBox>
                        <h3 style={{ fontWeight: "bold" }}>
                          {shop.rating.toFixed(1)}
                        </h3>
                        <span> /5</span>
                      </RatingBox>
                      <ReviewCount>{shop.reviewCount} reviews</ReviewCount>
                    </ProfileBoxRatingSection>
                    <div style={{ marginLeft: "10px" }}>
                      <h2>
                        {shop.companyName}
                        <sup style={{ fontSize: "15px" }}>{shop.country}</sup>
                      </h2>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          marginTop: "-8px",
                        }}
                      >
                        Seller since {moment(shop.createdAt).format("ll")}
                      </p>
                      <p style={{ marginTop: "-12px" }}>
                        <MdPerson style={{ marginTop: "-2px" }} />{" "}
                        {shop.fullname}
                      </p>
                      <p style={{ marginTop: "-12px" }}>
                        <MdLocationOn style={{ marginTop: "-2px" }} />{" "}
                        {`${shop.location.substring(0, 23)} ${
                          shop.location.length > 23 ? "..." : ""
                        }`}
                      </p>

                      <p
                        style={{
                          margin: "0",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginTop: "-5px",
                        }}
                        onClick={() => setIsModalOpen(true)}
                      >
                        <BiLogOut /> Log Out
                      </p>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={LoadingIcon}
                      alt="loading"
                      height="100"
                      width="100"
                    />
                  </div>
                )}
              </ProfileBox>
            </div>
            <div className="col-lg-3 col-sm-6">
              <RevenueBox>
                <BoxTop>
                  <h4>
                    <b>Revenue</b>
                  </h4>
                  <IconBox>
                    <BiMoney />
                  </IconBox>
                </BoxTop>
                <h4>{priceConverter(shop.totalPrice)}</h4>
                <IncreaseText
                  className={
                    shop.growthRate[0] === "-" ? "text-danger" : "text-success"
                  }
                >
                  <BsGraphUp /> {shop.growthRate}%{" "}
                  {`${shop.growthRate[0] === "-" ? "Down" : "Up"}`}
                </IncreaseText>
              </RevenueBox>
            </div>
            <div className="col-lg-3 col-sm-6">
              <ProductBox>
                <BoxTop>
                  <BoxHeader>
                    <b>Last Month Revenue</b>
                  </BoxHeader>
                  <IconBox>
                    <BiMoney />
                  </IconBox>
                </BoxTop>
                <h4>{priceConverter(shop.lastMonthRevenue)}</h4>
              </ProductBox>
            </div>
            <div className="col-lg-3 col-md-4 col-6">
              <ProductBox>
                <BoxTop>
                  <BoxHeader>
                    <b>On Sale</b>
                  </BoxHeader>
                  <IconBox>
                    <FiBox />
                  </IconBox>
                </BoxTop>
                <h4>
                  <b>{shop.productsOnSale}</b>
                </h4>
              </ProductBox>
            </div>
            <div className="col-lg-3 col-md-4 col-6">
              <ProductBox>
                <BoxTop>
                  <BoxHeader>
                    <b>Out Of Stock</b>
                  </BoxHeader>
                  <IconBox>
                    <FiBox />
                  </IconBox>
                </BoxTop>
                <h4>
                  <b>{shop.productsOutOfStock}</b>
                </h4>
              </ProductBox>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 col-6">
              <ProductBox>
                <BoxTop>
                  <BoxHeader>
                    <b>All Products</b>
                  </BoxHeader>
                  <IconBox>
                    <FiBox />
                  </IconBox>
                </BoxTop>
                <h4>
                  <b>{shop.allProducts}</b>
                </h4>
              </ProductBox>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 col-6">
              <ProductBox>
                <BoxTop>
                  <BoxHeader>
                    <b>Waiting Orders</b>
                  </BoxHeader>
                  <IconBox>
                    <FaShoppingCart />
                  </IconBox>
                </BoxTop>
                <h4>
                  <b>{shop.confirmationRequiredOrders}</b>
                </h4>
              </ProductBox>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 col-6">
              <ProductBox>
                <BoxTop>
                  <BoxHeader>
                    <b>Cancelled Orders</b>
                  </BoxHeader>
                  <IconBox>
                    <FaShoppingCart />
                  </IconBox>
                </BoxTop>
                <h4>
                  <b>{shop.cancelledOrders}</b>
                </h4>
              </ProductBox>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 col-6">
              <ProductBox>
                <BoxTop>
                  <BoxHeader>
                    <b>All Orders</b>
                  </BoxHeader>
                  <IconBox>
                    <FaShoppingCart />
                  </IconBox>
                </BoxTop>
                <h4>
                  <b>{shop.allOrders}</b>
                </h4>
              </ProductBox>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 col-6">
              <ProductBox>
                <BoxTop>
                  <BoxHeader>
                    <b>Customers</b>
                  </BoxHeader>
                  <IconBox>
                    <FaUserPlus />
                  </IconBox>
                </BoxTop>
                <h4>
                  <b>{shop.allCustomers}</b>
                </h4>
              </ProductBox>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <img src={LoadingIcon} alt="loading" height="100" width="100" />
          </div>
        )}
      </div>
    </>
  );
};

export default SellerHomePageSections;
