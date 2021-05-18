import React, { useState, useEffect } from "react";
import {
  deleteSellerRating,
  rateSeller,
} from "../redux/actions/rateSellerActions";
import { useDispatch, useSelector } from "react-redux";
import { BsStarFill, BsStar } from "react-icons/bs";
import styled from "styled-components";
import moment from "moment";
import Modal from "./messageBox";
import ReactStars from "react-rating-stars-component";
import LoadingIcon from "../assets/loading.gif";

const RateSellerStars = styled.div`
  display: none;
  position: absolute;
  bottom: 29px;
  left: 0px;
  background: white;
  border: 1px solid #dbdbdb;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  padding: 10px;
  min-width: 100%;
  width: 140px;
  font-size: 12px;
  cursor: auto;

  @media (max-width: 793px) {
    bottom: 45px;
  }
  @media (max-width: 766px) {
    bottom: 30px;
  }
`;
const RateSellerSection = styled.div`
  position: relative;
  padding: 5px;
  margin-top: -12px;
  &:hover ${RateSellerStars} {
    display: block;
  }
`;
const RateSellerText = styled.span``;
const RateSellersStarsTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid #dbdbdb;
`;
const BoxHeaderText = styled.span`
  font-size: 14px;
  font-weight: bold;
`;
const RatingItem = styled.div`
  border-bottom: 1.2px solid #dedede;
  margin-bottom: 15px;
`;
const DateText = styled.p`
  color: var(--text-muted);
  font-size: 14px;
  margin-top: -5px;
`;

const ProfilePageRatedSellersSection = ({ isEmpty, setIsEmpty }) => {
  const dispatch = useDispatch();
  const { ratedSellers, loading, error } = useSelector(
    (state) => state.RateSeller
  );
  const { user } = useSelector((state) => state.Auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingId, setRatingId] = useState();
  const [ratedSeller, setRatedSeller] = useState();
  const [isDisplayingRateError, setIsDisplayingRateError] = useState(false);

  useEffect(() => {
    if (ratedSellers.length < 1) setIsEmpty(true);
    if (ratedSellers.length > 0) setIsEmpty(false);
  }, []);

  useEffect(() => {
    setIsDisplayingRateError(true);
    setTimeout(() => setIsDisplayingRateError(false), 1500);
  }, [error]);

  const openModal = (id, seller) => {
    setRatingId(id);
    setRatedSeller(seller);
    setIsModalOpen(true);
  };
  const RateSeller = (val, seller) => {
    dispatch(
      rateSeller({
        rating: val,
        seller,
        user: user._id,
      })
    );
  };
  if (isEmpty) {
    return <h4>No Sellers Rated</h4>;
  }

  return (
    <div>
      {isModalOpen && (
        <Modal
          isRedux={true}
          action={deleteSellerRating}
          message="Do You Want To Delete This Review?"
          setIsModalOpen={setIsModalOpen}
          header="Delete Review"
          btnText="Delete"
          param={ratingId}
          secondParam={ratedSeller}
        />
      )}
      <div
        className="checkout-address-section-top w-100"
        style={{ position: "absolute", top: "0", left: "0" }}
      >
        <BoxHeaderText>{ratedSellers.length} Ratings</BoxHeaderText>
      </div>
      <section style={{ marginTop: "35px" }}>
        {ratedSellers.map((item, index) => {
          return (
            <RatingItem key={index}>
              <span style={{ fontWeight: "bold" }}>
                {item.sellerObject.fullname} - {item.sellerObject.companyName}
              </span>
              <p
                style={{
                  display: "block",
                  marginTop: "-3px",
                }}
              >
                {Array.from({ length: 5 }, (_, index) => {
                  const number = index + 0.5;
                  return (
                    <span key={index}>
                      {item.rating > number ? (
                        <BsStarFill style={{ color: "rgb(255, 215, 0)" }} />
                      ) : (
                        <BsStar style={{ color: "rgb(255, 215, 0)" }} />
                      )}
                    </span>
                  );
                })}
              </p>
              <section style={{ display: "flex" }}>
                <DateText>{moment(item.createdAt).format("ll")}</DateText>
                <RateSellerSection>
                  <RateSellerStars>
                    <RateSellersStarsTop>Edit Rating</RateSellersStarsTop>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {loading && (
                        <img
                          src={LoadingIcon}
                          alt="loading icon spinning"
                          height="40px"
                          width="40px"
                          style={{ marginTop: "10px" }}
                        />
                      )}
                      {error && isDisplayingRateError && (
                        <span className="text-danger">{error}</span>
                      )}
                      {!loading && !isDisplayingRateError && (
                        <div
                          style={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ReactStars
                            count={5}
                            a11y={false}
                            value={item.rating}
                            onChange={(val) => RateSeller(val, item.seller)}
                            size={24}
                            activeColor="#ffd700"
                            className="react-stars-seller-rating"
                          />
                        </div>
                      )}
                    </div>
                  </RateSellerStars>
                  <RateSellerText
                    style={{
                      fontSize: "14px",
                      marginTop: "-5px",
                      marginLeft: "15px",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                    }}
                  >
                    Edit
                  </RateSellerText>
                </RateSellerSection>
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "-5px",
                    marginLeft: "15px",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                  onClick={() => openModal(item._id, item.seller)}
                >
                  Delete
                </p>
              </section>
            </RatingItem>
          );
        })}
      </section>
    </div>
  );
};

export default ProfilePageRatedSellersSection;
