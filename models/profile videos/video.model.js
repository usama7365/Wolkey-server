// models/video.model.js
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoPath: {
      type: String,
      required: true,
    },
  },
  {
    collection: "ProfileVideo",
    timestamps: true,
  }
);

module.exports = mongoose.model("ProfileVideo", videoSchema);
