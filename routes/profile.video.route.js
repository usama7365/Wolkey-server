// routes/video.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const videoController = require('../controllers/profile.video.controller');
const verifyToken = require('../middlewares/verifyToken');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/videos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

// Post a video
router.post('/post-video', verifyToken, upload.any('video'), videoController.postVideo);

// Get user-specific videos
router.get('/user-videos', verifyToken, videoController.getUserVideos);

// New route to get all user-related videos and store in an array
router.get('/all-user-videos', verifyToken, videoController.getAllUserVideos);

router.get("/user-video-gallery/:userId", videoController.getUserVideoGallery);

module.exports = router;
