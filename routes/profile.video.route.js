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

router.post('/post-video', verifyToken, upload.any('video'), videoController.postVideo);

router.get("/user-videos/:userId", videoController.getVideosByUserId);

router.put("/increment-video-view/:videoId", videoController.incrementVideoView); 

router.get('/trending-videos', videoController.getTrendingVideos); 


router.delete('/delete-video/:videoId', verifyToken, videoController.deleteVideoByUserId);


module.exports = router;
