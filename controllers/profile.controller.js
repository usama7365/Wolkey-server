const Profile = require("../models/profile.model");
const User = require("../models/users.model");

exports.createProfile = async (req, res) => {
  try {
    const {
      name,
      title,
      city,
      gender,
      dateOfBirth,
      aboutUs,
      phoneNumber,
      age,
      subjectName,
      serviceNames,
      Nationality,
      education,
      specialityDegree,
      Experience,
      TeachingStyle,
      languages,
      prices,
      selectedTimes,
    } = req.body;

    const videoFile = req.files.selectedVideoFile;
    const imageFiles = req.files.selectedImageFiles; 

    console.log("req.files:", req.files);


    // return res.json({ files: req.files });

    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.profileId) {
      const requiredFields = [
        name,
        title,
        city,
        gender,
        dateOfBirth,
        aboutUs,
        phoneNumber,
        age,
        subjectName,
        serviceNames,
        Nationality,
        education,
        specialityDegree,
        Experience,
        TeachingStyle,
        languages,
        prices,
        selectedTimes,
      ];

      if (requiredFields.some((field) => !field)) {
        return res.status(400).json({ error: "Please fill all fields" });
      }
    }

    const profile = user.profileId
      ? await Profile.findById(user.profileId)
      : new Profile({ userId });

    profile.name = name || profile.name;
    profile.title = title || profile.title;
    profile.city = city || profile.city;
    profile.gender = gender || profile.gender;
    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
    profile.aboutUs = aboutUs || profile.aboutUs;
    profile.phoneNumber = phoneNumber || profile.phoneNumber;
    profile.age = age || profile.age;
    profile.subjectName = subjectName || profile.subjectName;
    profile.serviceNames = serviceNames || profile.serviceNames;
    profile.Nationality = Nationality || profile.Nationality;
    profile.education = education || profile.education;
    profile.specialityDegree = specialityDegree || profile.specialityDegree;
    profile.Experience = Experience || profile.Experience;
    profile.TeachingStyle = TeachingStyle || profile.TeachingStyle;
    profile.languages = languages || profile.languages;
    profile.prices = prices || profile.prices;
    profile.selectedTimes = selectedTimes || profile.selectedTimes;

    if (videoFile && videoFile.length > 0) {
   
      const videoFilePaths = videoFile.map(
        (file) => `/uploads/videos/${file.filename}`
      );
      console.log("video File Paths:", videoFilePaths);
      profile.selectedVideoFile = videoFilePaths;
    }

    
    if (imageFiles && imageFiles.length > 0) {
   
      const imageFilePaths = imageFiles.map(
        (file) => `/uploads/images/${file.filename}`
      );
      console.log("Image File Paths:", imageFilePaths);
      profile.selectedImageFiles = imageFilePaths;
    }


    await profile.save();

    user.profileId = profile._id;
    await user.save();

    const message =
    user.profileId && !user.profileId.equals(profile._id)
      ? "Profile updated successfully"
      : "Profile created successfully";

  res.status(201).json({
    message,
    profileId: profile._id,
  });
} catch (error) {
  console.error("Error creating/updating profile:", error);
  res
    .status(500)
    .json({ error: "An error occurred while creating/updating the profile" });
}
};

exports.getSingleProfileDetails = async (req, res) => {
  try {
    const profileId = req.params.profileId; 

    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the profile" });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    const user = await User.findById(loggedInUserId);
    if (!user.profileId) {
      return res.status(404).json({ error: "Profile not found for this user" });
    }

    const profile = await Profile.findById(user.profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the profile" });
  }
};

exports.searchProfiles = async (req, res) => {
  try {
    const { keywords } = req.query;

    const regexKeywords = new RegExp(keywords, "i");

    const profiles = await Profile.find({
      $or: [
        { title: regexKeywords },
        { aboutUs: regexKeywords },
        { name: regexKeywords },
      ],
    });

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ error: "No matching profiles found" });
    }

    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error searching profiles:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching profiles" });
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ error: "No profiles found" });
    }
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching profiles" });
  }
};

exports.rateProfile = async (req, res) => {
  try {
    const { stars, review } = req.body;
    const userId = req.user.userId;
    const profileId = req.params.profileId;

    // Check if the user has already rated this profile
    const existingRating = await Profile.findOne({
      _id: profileId,
      'ratings.userId': userId,
    });

    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this profile' });
    }

    const rating = { stars, review, userId };

    await Profile.updateOne(
      { _id: profileId },
      { $push: { ratings: rating } }
    );

    res.status(201).json({ message: 'Profile rated successfully' });
  } catch (error) {
    console.error('Error rating profile:', error);
    res.status(500).json({ error: 'An error occurred while rating the profile' });
  }
};


// Server-Side (Node.js/Express)

exports.deleteProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId; // Use req.params.profileId to get the profileId from the URL

    console.log("Deleting profile with _id:", profileId);

    // Check if the profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Delete the profile
    await Profile.findByIdAndDelete(profileId);

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the profile" });
  }
};


