const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin Controllers/adminController');
const orangeNavbarController = require('../../controllers/Admin Controllers/OangeNavbar.controller');
const greenNavbarController = require('../../controllers/Admin Controllers/GreenNavbar.controller');
const verifyToken = require("../../middlewares/verifyToken");
const agencyController =require('../../controllers/Admin Controllers/Registration items Signup/AgencyController')
const teacherController =require('../../controllers/Admin Controllers/Registration items Signup/TeacherController')
const advisoryController =require('../../controllers/Admin Controllers/Registration items Signup/AdvisoryController')

const ProfileController =require('../../controllers/profile.controller')

const UserController =require('../../controllers/Admin Controllers/User/ViewUser.controller')
const filterController = require('../../controllers/Admin Controllers/filter.controller');


router.post('/signup', adminController.AdminSignup);

router.post('/login', adminController.AdminLogin);

router.get('/verify/:token', adminController.AdminverifyAccount); 

// Users

// Get all users
router.get('/user',verifyToken, UserController.getAllUsers);

// Deactivate/Activate user
router.patch('/user/:id', verifyToken, UserController.toggleUserStatus);

// profiles

router.get("/all-profiles", ProfileController.getAllProfiles);

router.delete("/delete-profile/:profileId",  verifyToken, ProfileController.deleteProfile);

router.post("/filter-profiles", ProfileController.filterProfiles);

// OrangeNavbar Routes

router.post('/orange-menu',verifyToken, orangeNavbarController.createMenuItem);

router.get('/orange-menu', orangeNavbarController.getAllMenuItems);

router.put('/orange-menu/:id',verifyToken, orangeNavbarController.editMenuItem);

router.delete('/orange-menu/:id',verifyToken, orangeNavbarController.deleteMenuItem);

// GreenNavbar Routes
router.post('/green-menu', verifyToken, greenNavbarController.createGreenMenuItem);

router.get('/green-menu', greenNavbarController.getAllGreenMenuItems);

router.put('/green-menu/:id', verifyToken, greenNavbarController.editGreenMenuItem);

router.delete('/green-menu/:id', verifyToken, greenNavbarController.deleteGreenMenuItem);

// Regitration Routes

// Teacher Routes

router.post('/teacher-menu',verifyToken, teacherController.createTeacherRegistration);

router.get('/teacher-menu', teacherController.getAllTeacherRegistrations);

router.get('/teacher-menu/:id',verifyToken, teacherController.getTeacherRegistrationById);

router.put('/teacher-menu/:id',verifyToken, teacherController.updateTeacherRegistration);

router.delete('/teacher-menu/:id',verifyToken, teacherController.deleteTeacherRegistration);

// agency Routes

router.post('/agency-menu',verifyToken, agencyController.createAgencyRegistration);

router.get('/agency-menu', agencyController.getAllAgencyRegistrations);

router.get('/agency-menu/:id',verifyToken, agencyController.getAgencyRegistrationById);

router.put('/agency-menu/:id',verifyToken, agencyController.updateAgencyRegistration);

router.delete('/agency-menu/:id',verifyToken, agencyController.deleteAgencyRegistration);

// advisory Routes

router.post('/advisory-menu',verifyToken, advisoryController.createAdvisoryRegistration);

router.get('/advisory-menu', advisoryController.getAllAdvisoryRegistrations);

router.get('/advisory-menu/:id',verifyToken, advisoryController.getAdvisoryRegistrationById);

router.put('/advisory-menu/:id',verifyToken, advisoryController.updateAdvisoryRegistration);

router.delete('/advisory-menu/:id',verifyToken, advisoryController.deleteAdvisoryRegistration);


// Filter Routes

router.post('/filter',verifyToken, filterController.createFilter);

router.get('/filters', filterController.getAllFilters);

router.get('/filter/:id',verifyToken, filterController.getFilterById);

router.put('/filter/:id',verifyToken, filterController.updateFilter);

router.delete('/filter/:id',verifyToken, filterController.deleteFilter);

module.exports = router;
