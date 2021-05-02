const mongoose = require("mongoose");
const strOptions = { type: String, required: true };

const AddressSchema = new mongoose.Schema({
  name: strOptions,
  surname: strOptions,
  country: strOptions,
  phoneNumber: strOptions,
  address: strOptions,
  addressHeader: strOptions,
});

module.exports = mongoose.model("Address", AddressSchema);
