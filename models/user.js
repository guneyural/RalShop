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

userSchema.pre("save", async function (next) {
  let user = this;
  let newUsername = this.username.split(" ").join(".");
  this.username = newUsername;
  try {
    const hash = await bcrypt.hash(user.password, 10);
    this.password = hash;
  } catch (err) {
    if (err)
      next(new expressError("An error occured while creating the user.", 500));
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
