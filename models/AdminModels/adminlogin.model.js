const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema(
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
  },
  {
    collection: "Login",
  }
);


module.exports = mongoose.model('Login', LoginSchema);
