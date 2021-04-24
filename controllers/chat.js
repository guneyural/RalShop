const Chatroom = require("../models/chatroom");
const Message = require("../models/message");
const User = require("../models/user");
const Shop = require("../models/shop");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");

const createRoom = catchAsync(async (req, res, next) => {
  if (req.user) {
    const getUser = await User.findById(req.user.id);
    if (!getUser) return next(new expressError("User Does Not Exist", 404));
  }
  if (req.shop) {
    const getShop = await Shop.findById(req.shop.id);
    if (!getShop) return next(new expressError("Shop Does Not Exist", 404));
  }
  const user = req.user ? req.user : req.shop;
  const findChatroom = await Chatroom.findOne({
    $or: [{ creator: user.id }, { participant: req.body.participantId }],
  });
  if (!findChatroom) {
    const newChatroom = new Chatroom({
      creator: user.id,
      participant: req.body.participantId,
    });
    const chatroom = await newChatroom.save();

    // Return new chatroom as populated
    const populated = await chatroom.execPopulate("participant");
    return res.json(populated);
  }

  // Return chatroom as populated
  const populated = await findChatroom.execPopulate("participant");
  res.json(populated);
});

const getChatrooms = catchAsync(async (req, res, next) => {
  if (req.user) {
    const getUser = await User.findById(req.user.id);
    if (!getUser) return next(new expressError("User Does Not Exist", 404));
  }
  if (req.shop) {
    const getShop = await Shop.findById(req.shop.id);
    if (!getShop) return next(new expressError("Shop Does Not Exist", 404));
  }
  const user = req.user ? req.user : req.shop;
  const getRecentMessages = await Message.find({
    $or: [{ sender: user.id }, { receiver: user.id }],
  }).sort({ createdAt: "desc" });

  let rooms = new Set();
  getRecentMessages.forEach((message) => {
    rooms.add(message.chatroom);
  });
  let roomIds = [...rooms];
  const allChatrooms = await Chatroom.find({
    _id: { $in: [...roomIds] },
  }).sort({ createdAt: "desc" });
  res.json(allChatrooms);
});

const getMessages = catchAsync(async (req, res, next) => {
  if (req.user) {
    const getUser = await User.findById(req.user.id);
    if (!getUser) return next(new expressError("User Does Not Exist", 404));
  }
  if (req.shop) {
    const getShop = await Shop.findById(req.shop.id);
    if (!getShop) return next(new expressError("Shop Does Not Exist", 404));
  }
  const roomId = req.params.chatroom;
  const messages = await Message.find({ chatroom: roomId });
  res.json(messages);
});

module.exports = {
  createRoom,
  getChatrooms,
  getMessages,
};
