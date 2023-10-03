const mongoose = require('mongoose');

const RoleCountSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('RoleCount', RoleCountSchema);
