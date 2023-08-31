const mongoose = require('mongoose');

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

  personalDetails: {
    gender: String,
    age: Number,
    city: String,
    phoneNumber: Number,
    dateOfBirth: Date,
    languages: [String],
    specialityDegree: String,
    Nationality: String,
    education: String,
  },
  selectedFileNames: [String],
  selectedVideoFile: String,
}, {
  timestamps: true, 
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
