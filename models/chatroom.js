const mongoose = require("mongoose");

const ChatroomSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chatroom", ChatroomSchema);
