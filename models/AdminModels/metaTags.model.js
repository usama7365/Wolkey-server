const mongoose = require("mongoose");

const metaTagsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("MetaTag", metaTagsSchema);
