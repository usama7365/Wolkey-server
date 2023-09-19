const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema(
  {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: String,
  resetToken: String, 
  resetTokenExpiration: Date,
},

{
  collection: "Admin",
  timestamps: true,
}


);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
