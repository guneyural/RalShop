import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { deleteReview } from "../redux/actions/authActions";
import Modal from "./messageBox";
import Styled from "styled-components";
import { useHistory } from "react-router-dom";
import { BsStarFill, BsStar } from "react-icons/bs";
import moment from "moment";

const ReviewItem = Styled.div`
  border-bottom: 1.2px solid #dedede;
  margin-bottom: 15px;
`;
const DateText = Styled.p`
  color: var(--text-muted);
  font-size: 14px;
  margin-top: -5px;
`;
const BoxHeaderText = Styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const ProfilePageReviewsSection = ({ setIsEmpty, isEmpty }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewId, setReviewId] = useState();
  const { reviews } = useSelector((state) => state.Auth);
  const history = useHistory();

  useEffect(() => {
    if (reviews === null || reviews.length < 1) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [reviews]);

  const openModal = (id) => {
    setReviewId(id);
    setIsModalOpen(true);
  };

  if (isEmpty) {
    return <h4>No Reviews Added</h4>;
  }
  return (
    <>
      <div
        className="checkout-address-section-top w-100"
        style={{ position: "absolute", top: "0", left: "0" }}
      >
        <BoxHeaderText>{reviews.length} Reviews</BoxHeaderText>
      </div>
      {isModalOpen && (
        <Modal
          isRedux={true}
          action={deleteReview}
          message="Do You Want To Delete This Review?"
          setIsModalOpen={setIsModalOpen}
          header="Delete Review"
          btnText="Delete"
          param={reviewId}
        />
      )}

      {reviews !== null &&
        reviews.map((review, index) => {
          return (
            <ReviewItem
              key={index}
              style={index === 0 ? { marginTop: "35px" } : {}}
            >
              <span
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() =>
                  history.push(
                    `/product/${review.productId._id}/#${review._id}`
                  )
                }
              >
                {review.productId.title}
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
                    <span key={index} style={{ fontSize: "15px" }}>
                      {review.rating > number ? (
                        <BsStarFill style={{ color: "rgb(255, 215, 0)" }} />
                      ) : (
                        <BsStar style={{ color: "rgb(255, 215, 0)" }} />
                      )}
                    </span>
                  );
                })}
              </p>
              <p>{review.text}</p>
              <section style={{ display: "flex" }}>
                <DateText>
                  {moment(review.productId.createdAt).format("ll")}
                </DateText>
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "-5px",
                    marginLeft: "15px",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                  onClick={() => openModal(review._id)}
                >
                  Delete
                </p>
              </section>
            </ReviewItem>
          );
        })}
    </>
  );
};

export default ProfilePageReviewsSection;
