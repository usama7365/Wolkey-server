const mongoose = require("mongoose");

// const pricingSchema = new mongoose.Schema({
//   day :String,
//   time: String,
//   cost: Number,
// });

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: String,
  availabilityDays: String,
  availabilityMins: String,
  availabilityStatus: String,
  aboutUs: String,
  day :String,  
  time: String,
  cost: Number,
  subjectName: [String],
  serviceNames:[String],
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
    
  selectedFileNames: [
    {
      data: Buffer,
      contentType: String,
    },
  ],

  selectedVideoFile: {
    data: Buffer,
    contentType: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
