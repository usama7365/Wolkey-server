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

    console.log(user, "user")

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
      : new Profile({ userId: userId }); // Set the userId here

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

exports.getSingleProfileDetailsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; 

    const profile = await Profile.findOne({ userId: userId });

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

    const regexKeywords = new RegExp(keywords, 'i');

    const profiles = await Profile.find({
      $or: [
        { name: { $in: regexKeywords } },
        { title: { $in: regexKeywords } },
        { aboutUs: { $in: regexKeywords } },
        { subjectName: { $in: regexKeywords } }, 
        { serviceNames: { $in: regexKeywords } },
        { Experience: { $in: regexKeywords } },
        { TeachingStyle: { $in: regexKeywords } },
        { gender: { $in: regexKeywords } },
        { city: { $in: regexKeywords } },
        { languages: { $in: regexKeywords } },
        { specialityDegree: { $in: regexKeywords } },
        { Nationality: { $in: regexKeywords } },
        { education: { $in: regexKeywords } },
        {
          prices: {
            $elemMatch: { $in: regexKeywords },
          },
        },
        { availabilityMins: { $in: regexKeywords } },
        {
          selectedTimes: {
            $elemMatch: { $in: regexKeywords },
          },
        },
        { 'ratings.review': { $in: regexKeywords } },
      ],
    });

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ error: 'No matching profiles found' });
    }

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error searching profiles:', error);
    res.status(500).json({ error: 'An error occurred while searching profiles' });
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

    // Find and update the corresponding user document to remove the profileId reference
    const users = await User.find({ profileId: profileId });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users associated with this profile" });
    }

    // Loop through each user with the same profileId and remove the reference
    for (const user of users) {
      user.profileId = null; // Remove the profileId reference
      await user.save(); // Save the updated user document
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the profile" });
  }
};

exports.filterProfiles = async (req, res) => {
  try {
    const filters = req.body;

    // Build a MongoDB query based on the filters
    const query = {};

    if (filters.gender) {
      query.gender = filters.gender;
    }

    if (filters.languages && filters.languages.length > 0) {
      query.languages = { $in: filters.languages };
    }

    if (filters.ageMin && filters.ageMax) {
      query.age = { $gte: filters.ageMin, $lte: filters.ageMax };
    } else if (filters.ageMin) {
      query.age = { $gte: filters.ageMin };
    } else if (filters.ageMax) {
      query.age = { $lte: filters.ageMax };
    }

    if (filters.city) {
      query.city = filters.city;
    }

    if (filters.subjectName && filters.subjectName.length > 0) {
      query.subjectName = { $in: filters.subjectName };
    }

    // Add more filter conditions as needed for other fields

    // Execute the query
    const filteredProfiles = await Profile.find(query);

    res.status(200).json(filteredProfiles);
  } catch (error) {
    console.error('Error filtering profiles:', error);
    res.status(500).json({ error: 'An error occurred while filtering profiles' });
  }
};