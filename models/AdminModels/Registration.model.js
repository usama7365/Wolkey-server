const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  title: String,
  features: [String],
  buttons: String,
});

module.exports = mongoose.model('Registration', registrationSchema);
