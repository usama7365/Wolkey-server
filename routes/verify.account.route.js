const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verify.account.controller');

router.get('/:token', verifyController.verifyAccount);
 
module.exports = router;
