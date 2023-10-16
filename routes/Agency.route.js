const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middlewares/verifyToken');
const agencyProfileController = require('../controllers/Agency.controller');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/images');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extname = path.extname(file.originalname); // Get the original file extension
      cb(null, uniqueSuffix + extname); // Append the extension to the unique filename
    },
  });
  

const upload = multer({ storage });



router.post('/agency-image', verifyToken, upload.any('image'), agencyProfileController.uploadAgencyProfileImage);

router.post('/createOrUpdateAgencyProfile',verifyToken, agencyProfileController.createOrUpdateAgencyProfile);

router.get("/getAgencyProfileByUserId/:userId", verifyToken, agencyProfileController.getAgencyProfileByUserId);

router.get('/viewAgencyProfileImage/:userId', verifyToken, agencyProfileController.getImagesByUserId);



module.exports = router;