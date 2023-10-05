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
    AgencyprofileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AgencyProfile',
    },
    // postId:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Image',
    // },
    
    role: String,
    resetToken: String,
    resetTokenExpiration: Date,
    isActive: {
      type: Boolean,
      default: true,  // By default, users are active
    },
  },
  {
    collection: 'Users',
    timestamps: true,
  }
);

module.exports = mongoose.model('Users', UsersSchema);
