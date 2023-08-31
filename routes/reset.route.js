const express = require('express');
const router = express.Router();
const resetController = require('../controllers/reset.controllers');

router.get('/reset-password/:token', resetController.showResetForm);
router.post('/reset-password/:token', resetController.resetPassword);

module.exports = router;
