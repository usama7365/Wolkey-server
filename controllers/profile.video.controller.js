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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Please upload at least one video" });
    }


    const videoPaths = req.files.map((file) => `/uploads/videos/${file.filename}`);

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


exports.getVideosByUserId = async (req, res) => {
  const { userId } = req.params;

  try {

    const videos = await Video.find({ userId });

    if (!videos) {
      return res.status(404).json({ error: 'No videos found for this user' });
    }


    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'An error occurred while fetching videos' });
  }
};



exports.deleteVideoByUserId = async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.user;

  try {

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }


    if (video.userId.toString() !== userId) {
      return res.status(403).json({ error: "You don't have permission to delete this video" });
    }


    await video.remove();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "An error occurred while deleting the video" });
  } 
};


exports.incrementVideoView = async (req, res) => {
  const { videoId } = req.params;
  const clientIP = req.body.clientIP; 

  try {
      
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.viewedByIP.includes(clientIP)) {
      return res.status(400).json({ error: 'You have already viewed this video' });
    }

    video.views += 1;
    video.viewedByIP.push(clientIP);

    await video.save();

    res.status(200).json({ message: 'Video view count incremented' });
  } catch (error) {
    console.error('Error incrementing video view count:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while incrementing the video view count' });
  }
};

exports.getTrendingVideos = async (req, res) => {
  try {
    const trendingVideos = await Video.find()
      .sort({ views: -1 }) 
      .limit(5);

    res.status(200).json(trendingVideos);
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    res.status(500).json({ error: 'An error occurred while fetching trending videos' });
  }
};
