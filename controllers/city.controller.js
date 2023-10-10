const Profile = require("../models/profile.model");

exports.getAllCities = async (req, res) => {
  try {
    const cities = await Profile.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getTopCities = async (req, res) => {
  try {
    const topCities = await Profile.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 7 },
    ]);

    res.json(topCities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};