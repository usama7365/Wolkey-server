const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: [
    {
      type: String,
    }
  ]
});

const City = mongoose.model('cities', citySchema);

module.exports = City;
