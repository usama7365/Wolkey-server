const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../controllers/image.controller');
const verifyToken = require('../middlewares/verifyToken');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

// Post an image
router.post('/post-image', verifyToken, upload.any('image'), imageController.postImage);

// Get user-specific images
router.get('/user-images', verifyToken, imageController.getUserImages);

// New route to get all user-related post images and store in an array
router.get('/all-user-images', verifyToken, imageController.getAllUserImages);


router.get("/user-gallery/:profileId", imageController.getUserGallery);


module.exports = router;
