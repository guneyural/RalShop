require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const PORT = 3001 || process.env.PORT;
const DATABASE = process.env.DATABASE;
const expressError = require("./utils/expressError");
const Routes = require("./routes");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");

app.use(helmet());
app.use(sanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = socket(server);

io.on("connection", (socket) => {
  socket.on("join room", (roomId) => {
    console.log(`Bir odaya katılıyoruz. ID:${roomId}`);
    socket.join(roomId);

    socket.on("send message", (body) => {
      io.to(roomId).emit("message", body);
    });
  });
});

mongoose
  .connect(DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then(() => console.log("Connected To Database."))
  .catch((err) => console.log("Could Not Connect To Database." + err));

app.use("/api/user", Routes.UserRoutes);
app.use("/api/shop", Routes.ShopRoutes);
app.use("/api/cart", Routes.CartRoutes);
app.use("/api/product", Routes.ProductRoutes);
app.use("/api/review", Routes.ReviewRoutes);
app.use("/api/wishlist", Routes.WishlistRoutes);
app.use("/api/chat", Routes.ChatRoutes);
app.get("/", (req, res) => {
  res.send("Güney Ural");
});

app.all("*", (req, res, next) => {
  next(new expressError("Could Not Find Route.", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  console.log(err);
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).json({ statusCode, errorMessage: err.message });
});

server.listen(PORT, () => console.log(`Server on port ${PORT}`));
