const express = require("express");
const router = express.Router();
const { PostUserSchema } = require("../controllers/signup.controller");

router.post('/signup', PostUserSchema);

module.exports = router;
