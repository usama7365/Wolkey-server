const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { DashboardController } = require('../controllers/dashboard');
const { createProfile, getProfileById , getAllCities } = require('../controllers/profile.controller');



router.get('/dashboard', verifyToken, DashboardController);

router.post('/create-profile', verifyToken, createProfile);
router.post('/view-profile' ,verifyToken, getProfileById);

// router.get('/cities', verifyToken, getAllCities);


// router.get('/view-all', verifyToken, viewOtherProfiles);  



module.exports = router;
