const AgencyProfile = require('../models/agency.profile.model');
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

      res.status(200).json({
        message: "Agency profile updated successfully",
        profileId: existingProfile._id,
      });
    } else {
      const newAgencyProfile = new AgencyProfile({
        userId, // Set the userId when creating a new profile
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


module.exports = { createOrUpdateAgencyProfile, getAgencyProfileByUserId };
