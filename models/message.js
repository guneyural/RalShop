const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chatroom: { type: mongoose.Schema.Types.ObjectId, ref: "Chatroom" },
    body: { type: String, max: 700, default: "" },
    photo: {
      photoUrl: String,
      fileName: String,
    },
    isPhoto: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
