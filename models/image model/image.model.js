// models/image.model.js
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imagePath: 
      {
        type: String,
        required: true,
      },
  },
  {
    collection: "Image",
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);
