const mongoose = require("mongoose");
const strOptions = { type: String, required: true };

const AddressSchema = new mongoose.Schema({
  name: strOptions,
  surname: strOptions,
  country: strOptions,
  phoneNumber: strOptions,
  address: strOptions,
  addressHeader: strOptions,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Address", AddressSchema);
