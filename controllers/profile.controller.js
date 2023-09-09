const Profile = require("../models/profile.model");
const User = require("../models/users.model");
const City = require("../models/cities.model");


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

    console.log(req.body, "req");

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    // console.log("Request Body:", req.files);
    const ima = req.files?.selectedFileNames || [];
    const videoFile = req.files?.selectedVideoFile || null;
    console.log("Image Files:", ima);

    const userId = req.user.userId;
    console.log("User ID:", userId);

    // Check if the user already has a profile
    const user = await User.findById(userId);

    if (user.profileId) {
      // User already has a profile, update the existing profile
      const profile = await Profile.findById(user.profileId);
      if (!profile) {
        console.log("Profile not found for user:", userId);
        return res.status(404).json({ error: "Profile not found" });
      }

      // Store the original profile data for comparison
      const originalProfileData = {
        name: profile.name,
        title: profile.title,
        city: profile.city,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        aboutUs: profile.aboutUs,
        phoneNumber: profile.phoneNumber,
        age: profile.age,
        subjectName: profile.subjectName,
        serviceNames: profile.serviceNames,
        Nationality: profile.Nationality,
        education: profile.education,
        specialityDegree: profile.specialityDegree,
        Experience: profile.Experience,
        TeachingStyle: profile.TeachingStyle,
        languages: profile.languages,
        prices: profile.prices,
        selectedTimes: profile.selectedTimes,
        selectedFileNames: profile.selectedFileNames,
        selectedVideoFile: profile.selectedVideoFile,
      };

      profile.name = name;
      profile.title = title;
      profile.city = city;
      profile.gender = gender;
      profile.dateOfBirth = dateOfBirth;
      profile.aboutUs = aboutUs;
      profile.phoneNumber = phoneNumber;
      profile.age = age;
      profile.subjectName = subjectName;
      profile.serviceNames = serviceNames;
      profile.Nationality = Nationality;
      profile.education = education;
      profile.specialityDegree = specialityDegree;
      profile.Experience = Experience;
      profile.TeachingStyle = TeachingStyle;
      profile.languages = languages;
      (profile.prices = prices), (profile.selectedTimes = selectedTimes);

      // Handle image and video updates if provided

      if (Array.isArray(ima) && ima.length > 0) {
        const imageArray = ima.map((file) => ({
          data: file.data,
          contentType: file.mimetype,
        }));
        profile.selectedFileNames = imageArray;
      }

      if (videoFile) {
        profile.selectedVideoFile = {
          data: videoFile.data,
          contentType: videoFile.mimetype,
        };
      }

      await profile.save();

      // Check if the profile data has changed
      const updatedProfileData = {
        name: profile.name,
        title: profile.title,
        city: profile.city,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        aboutUs: profile.aboutUs,
        phoneNumber: profile.phoneNumber,
        age: profile.age,
        subjectName: profile.subjectName,
        serviceNames: profile.serviceNames,
        Nationality: profile.Nationality,
        education: profile.education,
        specialityDegree: profile.specialityDegree,
        Experience: profile.Experience,
        TeachingStyle: profile.TeachingStyle,
        languages: profile.languages,
        prices: profile.prices,
        selectedTimes: profile.selectedTimes,
        selectedFileNames: profile.selectedFileNames,
        selectedVideoFile: profile.selectedVideoFile,
      };

      const hasProfileChanged =
        JSON.stringify(originalProfileData) !==
        JSON.stringify(updatedProfileData);

      if (hasProfileChanged) {
        // Profile data has changed, send "Profile updated successfully" message
        await profile.save();

        res
          .status(200)
          .json({
            message: "Profile updated successfully",
            profileId: profile,
          });
      } else {
        // Profile data has not changed, send a different message if needed
        res
          .status(200)
          .json({
            message: "No changes made to the profile",
            profileId: user.profileId,
          });
      }
    } else {
      // User does not have a profile, create a new profile
      const imageFiles = req.files.selectedFileNames;
      let imageArray = [];

      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        for (const file of imageFiles) {
          imageArray.push({
            data: file.data,
            contentType: file.mimetype,
          });
        }
      }

      // Handle video upload and store it as binary data
      const videoFile = req.files.selectedVideoFile;
      let videoData = null;
      if (videoFile) {
        videoData = {
          data: videoFile.data,
          contentType: videoFile.mimetype,
        };
      }

      // Create a new profile with the userId included
      const profile = new Profile({
        userId,
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
        selectedFileNames: imageArray,
        selectedVideoFile: videoData,
      });

      await profile.save();

      // Assign the profileId to the user
      user.profileId = profile._id;
      await user.save();

      res
        .status(201)
        .json({
          message: "Profile created successfully",
          profileId: profile._id,
        });
    }
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating/updating the profile" });
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

exports.getAllCities = async (req, res) => {
  try {
    const citiesDocument = await City.findOne({}, "name");
    if (citiesDocument) {
      res.json(citiesDocument.name);
    } else {
      res.status(404).json({ message: "No cities found." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching cities." });
  }
};

// exports.viewOtherProfiles = async (req, res) => {
//   try {
//     const loggedInUserId = req.user.userId;

//     // Find profiles that do not belong to the logged-in user
//     const otherProfiles = await Profile.find({ _id: { $ne: loggedInUserId } });

//     res.status(200).json(otherProfiles);
//   } catch (error) {
//     console.error('Error viewing other profiles:', error);
//     res.status(500).json({ error: 'An error occurred while viewing other profiles' });
//   }
// };

// exports.viewOtherProfiles = async (req, res) => {
//   try {
//     const loggedInUserId = req.user.userId;

//     // Find profiles that do not belong to the logged-in user
//     const otherProfiles = await Profile.find({ _id: { $ne: loggedInUserId } });

//     res.status(200).json(otherProfiles);
//   } catch (error) {
//     console.error('Error viewing other profiles:', error);
//     res.status(500).json({ error: 'An error occurred while viewing other profiles' });
//   }
// };

// const Profile = require("../models/profile.model");
// const User = require("../models/users.model");
// const City = require("../models/cities.model");
// const multer= require("multer")

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads/images')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })

// exports.upload = multer({ storage: storage })

// // exports.createProfile2 = async (req, res) => {
// //   console.log(req.file, req.body)
// //   return res.json({
// //     message : "image upload"
// //   })
// // }
//   exports.createProfile = async (req, res) => {
//   console.log(req.file, req.body)

//   try {
//     const {
//       name,
//       title,
//       city,
//       gender,
//       dateOfBirth,
//       aboutUs,
//       phoneNumber,
//       age,
//       subjectName,
//       serviceNames,
//       Nationality,
//       education,
//       specialityDegree,
//       Experience,
//       TeachingStyle,
//       languages,
//       day,
//       time,
//       cost,
//       availabilityDays,
//       availabilityMins,
//       availabilityStatus,
//     } = req.body;

//     if (!name) {
//       return res.status(400).json({ error: 'Name is required' });
//     }
//     // console.log("Request Body:", req.files);
//     const ima = req.files?.selectedFileNames || [];
//     const videoFile = req.files?.selectedVideoFile || null;
//     console.log("Image Files:", ima);

//     const userId = req.user.userId;
//     console.log("User ID:", userId);

//     // Check if the user already has a profile
//     const user = await User.findById(userId);

//     if (user.profileId) {
//       // User already has a profile, update the existing profile
//       const profile = await Profile.findById(user.profileId);
//       if (!profile) {
//         console.log("Profile not found for user:", userId);
//         return res.status(404).json({ error: "Profile not found" });
//       }

//       // Store the original profile data for comparison
//       const originalProfileData = {
//         name: profile.name,
//         title: profile.title,
//         city: profile.city,
//         gender: profile.gender,
//         dateOfBirth: profile.dateOfBirth,
//         aboutUs: profile.aboutUs,
//         phoneNumber: profile.phoneNumber,
//         age: profile.age,
//         subjectName: profile.subjectName,
//         serviceNames: profile.serviceNames,
//         Nationality: profile.Nationality,
//         education: profile.education,
//         specialityDegree: profile.specialityDegree,
//         Experience: profile.Experience,
//         TeachingStyle: profile.TeachingStyle,
//         languages: profile.languages,
//         day: profile.day,
//         time: profile.time,
//         cost: profile.cost,
//         availabilityDays: profile.availabilityDays,
//         availabilityMins: profile.availabilityMins,
//         availabilityStatus: profile.availabilityStatus,
//         selectedFileNames: profile.selectedFileNames,
//         selectedVideoFile: profile.selectedVideoFile,
//       };

//       profile.name = name;
//       profile.title = title;
//       profile.city = city;
//       profile.gender = gender;
//       profile.dateOfBirth = dateOfBirth;
//       profile.aboutUs = aboutUs;
//       profile.phoneNumber = phoneNumber;
//       profile.age = age;
//       profile.subjectName = subjectName;
//       profile.serviceNames = serviceNames;
//       profile.Nationality = Nationality;
//       profile.education = education;
//       profile.specialityDegree = specialityDegree;
//       profile.Experience = Experience;
//       profile.TeachingStyle = TeachingStyle;
//       profile.languages = languages;
//       profile.day = day;
//       profile.time = time;
//       profile.cost = cost;
//       profile.availabilityDays = availabilityDays;
//       profile.availabilityMins = availabilityMins;
//       profile.availabilityStatus = availabilityStatus;


//       console.log(originalProfileData, "image", req.files)
//             // Handle image and video updates if provided

//             if (Array.isArray(ima) && ima.length > 0) {
//               // Extract paths of uploaded images
//               const imagePaths = ima.map((file) => `/uploads/images/${file.filename}`);
//               // Save image paths to the profile document
//               profile.selectedFileNames = imagePaths;
//             }
//             console.log('Uploaded Files:', req.files);

//             if (videoFile) {
//               profile.selectedVideoFile = {
//                 data: videoFile.data,
//                 contentType: videoFile.mimetype,
//               };
//             }
          
//             try {
//               await profile.save();
//             } catch (error) {
//               console.error("Error saving profile to the database:", error);
//             }

//       // Check if the profile data has changed
//       const updatedProfileData = {
//         name: profile.name,
//         title: profile.title,
//         city: profile.city,
//         gender: profile.gender,
//         dateOfBirth: profile.dateOfBirth,
//         aboutUs: profile.aboutUs,
//         phoneNumber: profile.phoneNumber,
//         age: profile.age,
//         subjectName: profile.subjectName,
//         serviceNames: profile.serviceNames,
//         Nationality: profile.Nationality,
//         education: profile.education,
//         specialityDegree: profile.specialityDegree,
//         Experience: profile.Experience,
//         TeachingStyle: profile.TeachingStyle,
//         languages: profile.languages,
//         day: profile.day,
//         time: profile.time,
//         cost: profile.cost,
//         availabilityDays: profile.availabilityDays,
//         availabilityMins: profile.availabilityMins,
//         availabilityStatus: profile.availabilityStatus,
//         selectedFileNames: profile.selectedFileNames,
//         selectedVideoFile: profile.selectedVideoFile,
//       };

//       const hasProfileChanged =
//         JSON.stringify(originalProfileData) !==
//         JSON.stringify(updatedProfileData);

//       if (hasProfileChanged) {
        
//         try {
//           await profile.save();
//         } catch (error) {
//           console.error("Error saving profile to the database:", error);
//         }

//         res
//           .status(200)
//           .json({ message: "Profile updated successfully", profileId: profile });
//       } else {
//         // Profile data has not changed, send a different message if needed
//         res.status(200).json({ message: "No changes made to the profile", profileId: user.profileId });
//       }
//     } else {
//       // User does not have a profile, create a new profile
//       const imageFiles = req.files.selectedFileNames;
//       let imageArray = [];
//       if (imageFiles) {
//         for (const file of imageFiles) {
//           imageArray.push({
//             data: file.data,
//             contentType: file.mimetype,
//           });
//         }
//       }

//       // Handle video upload and store it as binary data
//       const videoFile = req.files.selectedVideoFile;
//       let videoData = null;
//       if (videoFile) {
//         videoData = {
//           data: videoFile.data,
//           contentType: videoFile.mimetype,
//         };
//       }

//       // Create a new profile with the userId included
//       const profile = new Profile({
//         userId,
//         name,
//         title,
//         city,
//         gender,
//         dateOfBirth,
//         aboutUs,
//         phoneNumber,
//         age,
//         subjectName,
//         serviceNames,
//         Nationality,
//         education,
//         specialityDegree,
//         Experience,
//         TeachingStyle,
//         languages,
//         day,
//         time,
//         cost,
//         availabilityDays,
//         availabilityMins,
//         availabilityStatus,
//         selectedFileNames: imageArray,
//         selectedVideoFile: videoData,
//       });


//       // Assign the profileId to the user
//       user.profileId = profile._id;
//       await user.save();


//       res.status(201).json({ message: "Profile created successfully", profileId: profile._id });
//     }
//   }  catch (error) {
//     console.error("Error creating/updating profile:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating/updating the profile" });
//   }
// };


// exports.getProfileById = async (req, res) => {
//   try {
//     const loggedInUserId = req.user.userId;

//     const user = await User.findById(loggedInUserId);
//     if (!user.profileId) {
//       return res.status(404).json({ error: "Profile not found for this user" });
//     }

//     const profile = await Profile.findById(user.profileId);
//     if (!profile) {
//       return res.status(404).json({ error: "Profile not found" });
//     }

//     return res.status(200).json(profile);
    
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred while fetching the profile" });
//   }
// };

// exports.getAllCities = async (req, res) => {
//   try {
//     const citiesDocument = await City.findOne({}, "name");
//     if (citiesDocument) {
//       res.json(citiesDocument.name);
//     } else {
//       res.status(404).json({ message: "No cities found." });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while fetching cities." });
//   }
// };




