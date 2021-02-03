import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import styled from "styled-components";

const BrandName = styled.h1`
  font-weight: 300;
  font-size: 42px;
`;

const Muted = styled.span`
  color: var(--text-muted);
`;

const Colorful = styled.span`
  color: #346eeb;
  font-weight: 500;
  cursor: pointer;
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [emailOrUsername, setEmailOrUsername] = useState("");

  useEffect(() => {
    if (password.length >= 6) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [password]);

  return (
    <div className="row auth">
      <div className="col-sm-6 forms">
        <section>
          <h2>{isLogin ? "Login" : "Register"}</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            {isLogin && (
              <div className="form-section">
                <label htmlFor="emailOrUsername">Email Or Username</label>
                <input
                  type="text"
                  name="emailOrUsername"
                  placeholder="Email Or Username"
                  id="emailorUsername"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                />
              </div>
            )}
            {!isLogin && (
              <div className="form-section">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            {!isLogin && (
              <div className="form-section">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div className="form-section">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                id="password"
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isLogin && (
                <div className="form-text">
                  Password Must Be At Least 6 Characters
                </div>
              )}
            </div>
            {!isLogin && <Colorful>Forgot Password ?</Colorful>}
            <div className="form-section mt-2">
              <button className="default-btn" disabled={btnDisabled}>
                {isLogin ? "Login" : "Register"}
              </button>
            </div>
          </form>
          {isLogin ? (
            <span>
              Don't Have An Account ?{" "}
              <Colorful onClick={() => setIsLogin(false)}>Register</Colorful>
            </span>
          ) : (
            <span>
              Already Have An Account ?{" "}
              <Colorful onClick={() => setIsLogin(true)}>Login</Colorful>
            </span>
          )}
        </section>
      </div>
      <div className="col-sm-6 auth-second-col">
        <section>
          <img src={Logo} alt="logo" className="auth-logo" />
          <BrandName>UralShop</BrandName>
          <Muted>Güney Ural @ 2021</Muted>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
