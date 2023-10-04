const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const agencyProfileController = require('../controllers/Agency.controller');


router.post('/createOrUpdateAgencyProfile',verifyToken, agencyProfileController.createOrUpdateAgencyProfile);

router.get("/getAgencyProfile", (req, res, next) => {
    if (req.query.AgencyprofileId) {
      return res.redirect(`/getAgencyProfile/${req.query.AgencyprofileId}`);
    }
    return agencyProfileController.getAgencyProfileById(req, res, next);
  });


module.exports = router;