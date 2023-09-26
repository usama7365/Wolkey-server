const mongoose = require('mongoose');

const orangeNavbarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

});

const OrangeNavbar = mongoose.model('OrangeNavbar', orangeNavbarSchema);

module.exports = OrangeNavbar;
