// GreenNavbar.model.js
const mongoose = require('mongoose');

const greenNavbarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('GreenNavbar', greenNavbarSchema);
