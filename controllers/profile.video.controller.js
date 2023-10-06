// controllers/video.controller.js
const Video = require("../models/profile videos/video.model");
const User = require("../models/users.model");

exports.postVideo = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if there are any uploaded video files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Please upload at least one video" });
    }

    const videoPaths = req.files.map((file) => file.path.replace('public\\', ''));

    // Create a separate post for each video
    for (const videoPath of videoPaths) {
      const video = new Video({ userId, videoPath });
      await video.save();
    }

    res.status(201).json({ message: "Videos uploaded successfully" });
  } catch (error) {
    console.error("Error uploading videos:", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the videos" });
  }
};

exports.getUserVideos = async (req, res) => {
  const { userId } = req.user;

  try {
    const userVideos = await Video.find({ userId });
    res.status(200).json(userVideos);
  } catch (error) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ error: 'An error occurred while fetching user videos' });
  }
};

exports.getAllUserVideos = async (req, res) => {
  const { userId } = req.user;

  try {
    const userVideos = await Video.find({ userId });
    const videoPaths = userVideos.map((video) => video.videoPath.replace('public\\', ''));
    res.status(200).json({ userVideos, videoPaths });
  } catch (error) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ error: 'An error occurred while fetching user videos' });
  }
};

exports.getUserVideoGallery = async (req, res) => {
  const { userId } = req.params; // Use userId instead of profileId

  try {
    const userVideos = await Video.find({ userId });
    res.status(200).json(userVideos);
  } catch (error) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ error: 'An error occurred while fetching user videos' });
  }
};

