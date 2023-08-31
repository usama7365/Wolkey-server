const express = require("express");
const router = express.Router();
const { PostLoginSchema } = require("../controllers/Login.controllers");

router.post('/', PostLoginSchema);

module.exports = router;
    