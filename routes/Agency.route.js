const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const agencyProfileController = require('../controllers/Agency.controller');


router.post('/createOrUpdateAgencyProfile',verifyToken, agencyProfileController.createOrUpdateAgencyProfile);

router.get("/getAgencyProfile/:agencyProfileId", verifyToken, agencyProfileController.getAgencyProfileById);



module.exports = router;