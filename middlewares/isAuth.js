const jwt = require("jsonwebtoken");
const expressError = require("../utils/expressError");

module.exports.isUser = function (req, res, next) {
  const token = req.headers["user-token"];

  if (!token) next(new expressError("Login To See The Content.", 401));

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    req.shop = null;
    next();
  } catch (err) {
    next(new expressError("Login to See The Content", 401));
  }
};

module.exports.isShop = function (req, res, next) {
  const token = req.headers["shop-token"];

  if (!token) next(new expressError("Login To See The Content.", 401));

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = null;
    req.shop = decoded;
    next();
  } catch (err) {
    next(new expressError("Login to See The Content", 401));
  }
};

module.exports.isLoggedIn = function (req, res, next) {
  const userToken = req.headers["user-token"];
  const shopToken = req.headers["shop-token"];

  try {
    const decoded = jwt.verify(
      userToken ? userToken : shopToken,
      process.env.SECRET
    );
    req.user = userToken ? decoded : null;
    req.shop = userToken ? null : decoded;
    next();
  } catch (err) {
    next(new expressError("Login To See The Content", 401));
  }
};
