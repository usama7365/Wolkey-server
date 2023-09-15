const express = require('express');
const router = express.Router();
const path = require('path');
const { uploadVideo, incrementVideoViews, getAllVideos } = require('../controllers/video.controller');
const multer = require('multer');

// Multer configuration for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/videos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

// Route for uploading a video
router.post('/upload', upload.single('video'), uploadVideo);


 router.put('/:videoId/views', incrementVideoViews);
 
router.get('/all', getAllVideos);


module.exports = router;
