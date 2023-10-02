const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const agencyProfileController = require('../controllers/Agency.controller');



router.post('/createOrUpdateAgencyProfile',verifyToken, agencyProfileController.createOrUpdateAgencyProfile);

router.get("/getAgencyProfile", verifyToken, (req, res, next) => {
    if (req.query.profileId) {
      return res.redirect(`/getAgencyProfile/${req.query.profileId}`);
    }
    return getProfileById(req, res, next);
  });


module.exports = router;