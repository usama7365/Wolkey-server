const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileId: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile', 
    },

    resetToken: String, 
    resetTokenExpiration: Date,
  },
  {
    collection: "Users",
    timestamps: true, 
  }
);

module.exports = mongoose.model('Users', UsersSchema);
