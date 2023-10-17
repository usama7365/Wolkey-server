const AgencyProfile = require('../models/agency.profile.model');
const AgencyProfileImage = require('../models/agency.profileImage')
const User = require('../models/users.model');

const createOrUpdateAgencyProfile = async (req, res) => {
  try {
    const {
      kvkNumber,
      btwNumber,
      companyName,
      contact,
      PhoneNumber,
      zipCode,
      city,
      streetName,
      houseNumber,
    } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: "Company Name is required" });
    }

    const { userId } = req.user; // Get the user ID from the request

    const existingProfile = await AgencyProfile.findOne({ userId });

    if (existingProfile) {
      // Agency profile already exists, update the existing profile
      // ...

      await existingProfile.save();

      // Set the AgencyprofileId in the Users collection
      const user = await User.findById(userId);
      if (user) {
        user.AgencyprofileId = existingProfile._id;
        await user.save();
      }

      res.status(200).json({
        message: "Agency profile updated successfully",
        profileId: existingProfile._id,
      });
    } else {
      const newAgencyProfile = new AgencyProfile({
        userId,
        kvkNumber,
        btwNumber,
        companyName,
        contact,
        PhoneNumber,
        zipCode,
        city,
        streetName,
        houseNumber,
      });

      await newAgencyProfile.save();

      // Set the AgencyprofileId in the Users collection
      const user = await User.findById(userId);
      if (user) {
        user.AgencyprofileId = newAgencyProfile._id;
        await user.save();
      }

      res.status(201).json({
        message: "Agency profile created successfully",
        AgencyprofileId: newAgencyProfile._id,
      });
    }
  } catch (error) {
    console.error("Error creating/updating agency profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating/updating the agency profile" });
  }
};



const getAgencyProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve the agency profile associated with the user
    const agencyProfile = await AgencyProfile.findOne({ userId: user._id });

    if (!agencyProfile) {
      return res.status(404).json({ error: "Agency profile not found for this user" });
    }

    res.status(200).json({ agencyProfile });
  } catch (error) {
    console.error("Error fetching agency profile by user ID:", error);
    res.status(500).json({ error: "An error occurred while fetching the agency profile" });
  }
};

const uploadAgencyProfileImage = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if there are any uploaded files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Please upload at least one image" });
    }

    // Get the existing image for the user, if any
    const existingImage = await AgencyProfileImage.findOne({ userId });

    if (existingImage) {
      // If an image already exists, delete it from the server
      const existingImagePath = path.join(__dirname, '..', existingImage.AgencyProfileImagePath);
      if (fs.existsSync(existingImagePath)) {
        fs.unlinkSync(existingImagePath);
      }

      // Update the existing image with the new one
      existingImage.AgencyProfileImagePath = `/uploads/images/${req.files[0].filename}`;
      await existingImage.save();
      res.status(200).json({ message: "Image replaced successfully" });
    } else {
      // Create a new image record
      const image = new AgencyProfileImage({
        userId,
        AgencyProfileImagePath: `/uploads/images/${req.files[0].filename}`,
      });
      await image.save();
      res.status(201).json({ message: "Image uploaded successfully" });
    }
  } catch (error) {
    console.error("Error uploading/replacing image:", error);
    res.status(500).json({ error: "An error occurred while uploading/replacing the image" });
  }
};

const getImagesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find images by user ID
    const images = await AgencyProfileImage.find({ userId });

    if (!images) {
      return res.status(404).json({ error: "No images found for the user" });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images by user ID:", error);
    res.status(500).json({ error: "An error occurred while fetching images" });
  }
};

module.exports = { createOrUpdateAgencyProfile, getAgencyProfileByUserId , uploadAgencyProfileImage, getImagesByUserId};
