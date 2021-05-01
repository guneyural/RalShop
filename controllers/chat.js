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
    const populated = await chatroom.execPopulate("participant creator");
    return res.json(populated);
  }

  // Return chatroom as populated
  const populated = await findChatroom.execPopulate("participant creator");
  res.json(populated);
});

const getChatrooms = catchAsync(async (req, res, next) => {
  // Check if user exists
  if (req.user) {
    const getUser = await User.findById(req.user.id);
    if (!getUser) return next(new expressError("User Does Not Exist", 404));
  }
  if (req.shop) {
    const getShop = await Shop.findById(req.shop.id);
    if (!getShop) return next(new expressError("Shop Does Not Exist", 404));
  }
  // set user variable equal to current user
  const user = req.user ? req.user : req.shop;
  // get all the messages that the user sent or received
  const getRecentMessages = await Message.find({
    $or: [{ sender: user.id }, { receiver: user.id }],
  }).sort({ createdAt: "desc" });
  // extract the chatroom ids from messages and append all ids to set
  // because in sets you cant duplicate
  let rooms = new Set();
  getRecentMessages.forEach((message) => {
    rooms.add(message.chatroom);
  });
  let roomIds = [...rooms];

  // get all the chatrooms in roomIds array
  const allChatrooms = await Chatroom.find({
    _id: { $in: [...roomIds] },
  })
    .sort({ createdAt: "desc" })
    .populate("participant creator");

  // get all chatrooms and get the last message
  let chatroomArray = [];
  allChatrooms.forEach((chatroom) => {
    // Get the newest message that's charoom id is the current chatroom's id
    chatroomArray.push({
      chatroom,
      lastMessage: getRecentMessages[0],
    });
  });
  res.json(chatroomArray);
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

const sendImage = catchAsync(async (req, res) => {
  const { sender, receiver, chatroom } = req.body;
  const image = req.file;
  const createMessageObj = new Message({
    sender,
    receiver,
    chatroom,
    photo: {
      photoUrl: image.path,
      fileName: image.filename,
    },
    isPhoto: true,
  });
  let newMessage = await createMessageObj.save();
  res.json(newMessage);
});

module.exports = {
  createRoom,
  getChatrooms,
  getMessages,
  sendImage,
};
