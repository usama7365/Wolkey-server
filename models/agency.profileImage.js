// models/image.model.js
const mongoose = require("mongoose");

const AgencyimageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    AgencyProfileImagePath: 
      {
        type: String,
        required: true,
      },
  },
  {
    collection: "AgencyProfileImage",
    timestamps: true,
  }
);

module.exports = mongoose.model("AgencyProfileImage", AgencyimageSchema);
