require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const PORT = 3001 || process.env.PORT;
const DATABASE = process.env.DATABASE;
const expressError = require("./utils/expressError");
const Routes = require("./routes");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then(() => console.log("Connected To Database."))
  .catch((err) => console.log("Could Not Connect To Database." + err));

app.use("/user", Routes.UserRoutes);
app.use("/shop", Routes.ShopRoutes);
app.use("/cart", Routes.CartRoutes);
app.use("/product", Routes.ProductRoutes);
app.get("/", (req, res) => {
  res.send("Güney Ural");
});

app.all("*", (req, res, next) => {
  next(expressError("Could Not Find Route.", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).json({ statusCode, errorMessage: err.message });
});

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
