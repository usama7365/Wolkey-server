const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    enum: ['dropdown', 'text'], // Enum for input types
    required: true,
  },
  dropdownValues: [String], // Array to store dropdown values
});

module.exports = mongoose.model('Filter', filterSchema);