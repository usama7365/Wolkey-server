const mongoose = require("mongoose");

const agencyProfileSchema = new mongoose.Schema({
  kvkNumber: String,
  btwNumber: String,
  companyName: String,
  contact: String,
  PhoneNumber: Number,
  zipCode: String,
  city: String,
  streetName: String,
  houseNumber: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

});

const AgencyProfile = mongoose.model("AgencyProfile", agencyProfileSchema);

module.exports = AgencyProfile;
