const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/forgot-password', authController.forgotPassword);

module.exports = router;