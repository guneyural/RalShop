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
    $and: [{ creator: user.id }, { participant: req.body.participantId }],
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
  // Check if user with that id exists
  if (req.user) {
    const getUser = await User.findById(req.user.id);
    if (!getUser) return next(new expressError("User Does Not Exist", 404));
  }
  if (req.shop) {
    const getShop = await Shop.findById(req.shop.id);
    if (!getShop) return next(new expressError("Shop Does Not Exist", 404));
  }
  // Get userId and roomId
  const user = req.user ? req.user : req.shop;
  const roomId = req.params.chatroom;
  //Get Chatroom by id and get participants
  const getChatroom = await Chatroom.findById(roomId);
  let participants = [getChatroom.creator, getChatroom.participant];
  //Check if current user is one of the participants
  let isParticipant = participants.some((participant) => {
    return user.id == participant;
  });

  if (isParticipant) {
    const messages = await Message.find({ chatroom: roomId }).sort({
      createdAt: "desc",
    });
    return res.json(messages);
  } else {
    return next(new expressError("Not Participant Of This Chatroom.", 403));
  }
});

module.exports = {
  createRoom,
  getChatrooms,
  getMessages,
};
