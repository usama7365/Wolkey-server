const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  profileName: String,
  postingTime: Date,
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Video', videoSchema);
