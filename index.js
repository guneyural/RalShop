require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const PORT = process.env.PORT || 3002;
const DATABASE = process.env.DATABASE;
const expressError = require("./utils/expressError");
const Routes = require("./routes");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");
const Message = require("./models/message");
const cors = require("cors");

app.use(cors());
app.use(helmet());
app.use(sanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const io = socket(server, {
  cors: { origin: "https://ural-shop.herokuapp.com/" },
});
let users = {};
io.on("connection", (socket) => {
  socket.on("user connected", (userId) => {
    if (users[userId]) {
      socket.emit(
        "error",
        "UralShop Chat probably opened in another tab. You are disconnected now."
      );
      socket.disconnect();
      delete users[userId];
    }
    users[userId] = { roomId: null, socketId: socket.id };
    io.emit("user data", users);

    socket.on("join room", (roomId) => {
      users[userId] = { roomId };

      socket.join(roomId);
      io.emit("user data", users);

      io.to(roomId).emit("get chat messages");

      socket.on("message seen", () => {
        Message.updateMany(
          {
            $and: [{ chatroom: roomId }, { receiver: userId }],
          },
          { seen: true }
        ).then(() => {
          io.to(roomId).emit("get chat messages");
        });
      });

      socket.on("start typing", () => {
        socket.broadcast.to(roomId).emit("typing", true);
      });

      socket.on("stop typing", () => {
        socket.broadcast.to(roomId).emit("typing", false);
      });

      socket.on("send message", async (message) => {
        const { sender, receiver, chatroom, body, isPhoto } = message;

        let countRoomMember = 0;
        for (const [key, value] of Object.entries(users)) {
          const { roomId } = value;
          if (roomId === chatroom) {
            countRoomMember++;
          }
        }

        if (!isPhoto) {
          const messageObject = new Message({
            sender,
            receiver,
            chatroom,
            body,
            seen: countRoomMember > 1 ? true : false,
          });
          messageObject.save((err, msg) => {
            if (err) {
              socket
                .to(roomId)
                .emit("error", "An error occured while sending the message.");
            } else {
              io.to(roomId).emit("message sent", msg);
              if (countRoomMember === 1) {
                socket.broadcast
                  .to(users[receiver])
                  .emit("message", "for your eyes only");
              }
            }
          });
        } else {
          //const getPhotoMessage = await Message.findById(message._id)
          const updatedMessage = await Message.findByIdAndUpdate(
            message._id,
            {
              seen: countRoomMember > 1 ? true : false,
            },
            { new: true }
          );
          io.to(roomId).emit("message sent", updatedMessage);
        }
      });
    });

    socket.on("left room", (roomId) => {
      users[userId] = { roomId: null };
      socket.leave(roomId);
      delete users[userId];
      socket.broadcast.to(roomId).emit("typing", false);
      socket.disconnect();
      io.emit("user data", users);
    });

    socket.on("disconnect", () => {
      delete users[userId];
      io.emit("user data", users);
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
app.use("/api/address", Routes.AddressRoutes);
app.use("/api/stripe", Routes.StripeRoutes);
app.use("/api/order", Routes.OrderRoutes);
app.use("/api/seller_rating", Routes.SellerRatingRoutes);
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
