import React, { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div>
      <h1>{isLogin ? "You Are Loggin in" : "You Are Registering"}</h1>
    </div>
  );
};

export default AuthPage;
