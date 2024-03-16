const express = require("express");
const { Logout, google } = require("../controllers/user.controller.js");

const router = express.Router();

router.post("/google", google);
router.post("/logout", Logout);

module.exports = router;
