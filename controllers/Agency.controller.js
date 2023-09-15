const AgencyProfile = require('../models/agency.profile.model');

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
    } else {
      // Agency profile does not exist, create a new one
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
        profileId: newAgencyProfile._id,
      });
    }
  } catch (error) {
    console.error("Error creating/updating agency profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating/updating the agency profile" });
  }
};

module.exports = { createOrUpdateAgencyProfile };
