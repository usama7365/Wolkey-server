const path = require('path');
const Video = require('../models/video.model');

// Controller to handle video upload
const uploadVideo = async (req, res) => {

    console.log(req.body, "body");
    console.log(req.file, "File"); 
  try {


    // return res.json({ files: req.file }); 

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a video file' });
    }

    const { title, profileName } = req.body;

    if (!title || !profileName) {
      return res.status(400).json({ error: 'Title and profile name are required' });
    }

    const video = new Video({
      title,
      videoUrl: `/uploads/videos/${req.file.filename}`,
      profileName,
      postingTime: new Date(),
    });

    await video.save();

    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'An error occurred while uploading the video' });
  }
};

const incrementVideoViews = async (req, res) => {
  try {
    const { videoId } = req.params;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress; 

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.lastViewedIP !== clientIP) {

      video.views += 1;

      video.lastViewedIP = clientIP;

      await video.save();
    }

    res.status(200).json({ message: 'Video views incremented', views: video.views });
  } catch (error) {
    console.error('Error incrementing video views:', error);
    res.status(500).json({ error: 'An error occurred while incrementing views' });
  }
};



const getAllVideos = async (req, res) => {
    try {
      const videos = await Video.find();
      res.status(200).json({ videos });
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'An error occurred while fetching videos' });
    }
  };

  module.exports = { uploadVideo, incrementVideoViews, getAllVideos };
