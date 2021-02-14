import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { sellerLogin } from "../../redux/actions/sellerActions";
import { Link } from "react-router-dom";

const PageHeader = styled.h1`
  font-weight: 300;
  text-align: center;
`;
const BrandName = styled.h1`
  font-weight: 400;
  margin-top: -10px;
  font-size: 16px;
  text-align: center;
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

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const Colorful = styled.span`
  color: #346eeb;
  font-weight: 500;
  cursor: pointer;
`;
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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const Seller = useSelector((state) => state.Seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (password.length >= 6) {
      setBtnDisabled(false);
      if (Seller.loading) {
        setBtnDisabled(true);
      } else {
        setBtnDisabled(false);
      }
    } else {
      setBtnDisabled(true);
    }
  }, [password, Seller]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sellerLogin(email, password));
  };

  return (
    <div>
      <PageHeader>Login As Seller</PageHeader>
      <BrandName>UralShop</BrandName>
      <hr />
      <CenterDiv>
        <CenterBox>
          <p style={{ textAlign: "center", fontSize: "32px" }}>Login</p>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-section">
              <Labels htmlFor="email">Email</Labels>
              <InputField
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-section">
              <Labels htmlFor="password">Password</Labels>
              <InputField
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Colorful style={{ textDecoration: "underline" }}>
              Forgot Password?
            </Colorful>
            <button className="default-btn w-100 mt-2" disabled={btnDisabled}>
              {Seller.loading ? "Loading..." : "Login"}
            </button>
            <p className="mt-2">
              Don't have an account?{" "}
              <Link to="/seller/register">
                <Colorful style={{ textDecoration: "underline" }}>
                  Register as seller
                </Colorful>
              </Link>
            </p>
          </form>
          {Seller.error.message !== null && (
            <span className="text-danger">
              {Seller.error.message !== "Login To See The Content." &&
                Seller.error.message}
            </span>
          )}
        </CenterBox>
      </CenterDiv>
    </div>
  );
};

export default LoginPage;
