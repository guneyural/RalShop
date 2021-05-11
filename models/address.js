const mongoose = require("mongoose");
const strOptions = { type: String, required: true };

const AddressSchema = new mongoose.Schema({
  name: strOptions,
  surname: strOptions,
  country: strOptions,
  phoneNumber: strOptions,
  address: strOptions,
  addressHeader: strOptions,
  state: strOptions,
  city: strOptions,
  email: strOptions,
  addressType: {
    type: String,
    enum: ["delivery", "billing"],
    default: "delivery",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Address", AddressSchema);
