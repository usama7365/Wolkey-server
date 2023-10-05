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

    const existingProfile = await AgencyProfile.findOne({ companyName });

    if (existingProfile) {
      // Agency profile already exists, update the existing profile
      existingProfile.kvkNumber = kvkNumber;
      existingProfile.btwNumber = btwNumber;
      existingProfile.contact = contact;
      existingProfile.PhoneNumber = PhoneNumber;
      existingProfile.zipCode = zipCode;
      existingProfile.city = city;
      existingProfile.streetName = streetName;
      existingProfile.houseNumber = houseNumber;

      await existingProfile.save();

      res.status(200).json({
        message: "Agency profile updated successfully",
        profileId: existingProfile._id,
      });

      const { userId } = req.user;
      console.log("User ID:", userId);

      const user = await User.findById(userId);
      console.log("User Object:", user);

      if (user) {
        user.AgencyprofileId = existingProfile._id;
        await user.save();
      }
    } else {
      const newAgencyProfile = new AgencyProfile({
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

      const { userId } = req.user;
      const user = await User.findById(userId);
      if (user) {
        user.AgencyprofileId = newAgencyProfile._id;
        await user.save();
      }
    }
  } catch (error) {
    console.error("Error creating/updating agency profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating/updating the agency profile" });
  }
};

const getAgencyProfileById = async (req, res) => {
  try {
    const agencyProfileId = req.params.agencyProfileId;
    
    const agencyProfile = await AgencyProfile.findById(agencyProfileId);

    if (!agencyProfile) {
      return res.status(404).json({ error: "Agency profile not found" });
    }

    res.status(200).json({ agencyProfile });
  } catch (error) {
    console.error("Error fetching agency profile by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching the agency profile" });
  }
};

module.exports = { createOrUpdateAgencyProfile, getAgencyProfileById };
