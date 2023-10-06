const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: String,
    aboutUs: String,
    subjectName: [String],
    serviceNames: [String],
    Experience: String,
    TeachingStyle: String,
    gender: String,
    age: Number,
    city: String,
    phoneNumber: Number,
    dateOfBirth: Date,
    languages: [String],
    specialityDegree: String,
    Nationality: String,
    education: String,
    prices: [],
    availabilityDays: {
      type: String,
    },

    availabilityMins: {
      type: String,
    },
    selectedTimes: Array,

    selectedImageFiles: [
      {
        type: String,
      },
    ],

    selectedVideoFile: [
      {
        type: String,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    ratings: [
      {
        stars: {
          type: Number,
          required: true,
        },
        review: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
      },
    ],
  },
  {
    collection: "Profile",
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
