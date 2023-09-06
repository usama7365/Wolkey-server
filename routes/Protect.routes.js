const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { DashboardController } = require('../controllers/dashboard');
const { createProfile, getProfileById , getAllCities } = require('../controllers/profile.controller');
const { logout } = require('../controllers/logout.controller');


router.get('/dashboard', verifyToken, DashboardController);

router.post('/create-profile', verifyToken, createProfile);
router.get('/view-profile' ,verifyToken, getProfileById);
 
// router.get('/cities', verifyToken, getAllCities);

// router.post('/logout', verifyToken, logout);



module.exports = router;
