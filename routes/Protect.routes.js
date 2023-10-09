const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { DashboardController } = require("../controllers/dashboard");
const {createProfile,getProfileById,deleteProfile,getAllProfiles,searchProfiles,rateProfile,getSingleProfileDetails,getSingleProfileDetailsByUserId} = require("../controllers/profile.controller");
const cityController = require("../controllers/city.controller");
const { logout } = require("../controllers/logout.controller");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const dirs = [
  "./public",
  "./public/uploads",
  "./public/uploads/images",
  "./public/uploads/videos",
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === "selectedImageFiles") {
      uploadPath = "./public/uploads/images";
    }
    if (file.fieldname === "selectedVideoFile") {
      uploadPath = "./public/uploads/videos";
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/create-profile",
  verifyToken,
  upload.fields([
    {
      name: "selectedImageFiles",
      maxCount: 50,
    },
    {
      name: "selectedVideoFile",
      maxCount: 1,
    },
  ]),
  createProfile
);

router.get("/view-profile/:userId", getSingleProfileDetailsByUserId);

router.post("/rate-profile/:profileId", verifyToken, rateProfile);

router.post("/rate-profile/:profileId", verifyToken, rateProfile);

router.get("/all-profiles", getAllProfiles);

router.get("/search-profiles", searchProfiles);

router.delete("/delete-profile/:profileId", verifyToken, deleteProfile);

router.get("/cities", cityController.getAllCities);

module.exports = router;