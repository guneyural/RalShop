import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AiOutlineLock } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { sendForgotPasswordEmail } from "../../redux/actions/sellerActions";

const CenterDiv = styled.div`
  margin-top: 30px;
  @media (max-width: 450px) {
    width: 100%;
  }
`;

const CenterBox = styled.div`
  border: 1px solid #c2c2c2;
  background: white;
  margin: auto;
  padding: 10px 40px;
  width: 400px;
  box-shadow: 2px 2px 10px #dedede;
  position: relative;
  @media (max-width: 450px) {
    width: 100%;
  }
`;

const InputField = styled.input`
  padding: 4px 12px;
  border-radius: 3px;
  background: #fafafa;
  border: 1px solid #c2c2c2;
  width: 100%;
`;

const SectionBottom = styled.section`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #efefef;
  border-top: 1px solid #c2c2c2;
  font-weight: 500;
  text-align: center;
  padding: 7px;
  :hover {
    text-decoration: underline;
  }
`;
const ForgotPasswordSendEmailPage = () => {
  const [email, setEmail] = useState("");
  const Seller = useSelector((state) => state.Seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      Seller.forgotPassword.isPasswordReset &&
      Seller.forgotPassword.sendEmailSuccess
    ) {
      localStorage.setItem("seller_password_reset", true);
      if (email !== "") localStorage.setItem("seller_email", email);
    }
  }, [Seller, dispatch]);

  const sendCode = (e) => {
    e.preventDefault();
    dispatch(sendForgotPasswordEmail(email, window.origin));
  };

  return (
    <CenterDiv>
      <CenterBox>
        <AiOutlineLock
          style={{ display: "grid", margin: "auto", fontSize: "5rem" }}
        />
        <h2 style={{ textAlign: "center" }}>Forgot Password?</h2>
        <p
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            fontSize: "15px",
          }}
        >
          Enter your email and we'll send you a code to get your account back.
        </p>
        <form style={{ margin: "auto" }} onSubmit={(e) => sendCode(e)}>
          <InputField
            type="email"
            name="email"
            id="email"
            aria-label="email input"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="default-btn mt-3 w-100"
            disabled={email.length < 1 || Seller.loading ? true : false}
          >
            {Seller.loading ? "Loading..." : "Send Login Link"}
          </button>
          {Seller.error.message ? (
            <span className="text-danger">
              {Seller.error.message !== "Login To See The Content." &&
                Seller.error.message}
            </span>
          ) : (
            Seller.forgotPassword.sendEmailSuccess && (
              <span className="text-success">
                Email Sent. Click the link we sent to your mail.
              </span>
            )
          )}
        </form>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "14px",
            fontWeight: "500",
            paddingTop: "30px",
            paddingBottom: "40px",
          }}
        >
          OR
        </p>
        <SectionBottom>
          <Link
            to="/seller/login"
            style={{ color: "var(--primary-text)", textDecoration: "none" }}
          >
            Back To Login Page
          </Link>
        </SectionBottom>
      </CenterBox>
    </CenterDiv>
  );
};

export default ForgotPasswordSendEmailPage;
