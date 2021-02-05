const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const expressError = require("../utils/expressError");

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_150");
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      max: 30,
      unique: true,
      required: true,
    },
    profilePhoto: imageSchema,
    hasPhoto: { type: Boolean, default: false },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
