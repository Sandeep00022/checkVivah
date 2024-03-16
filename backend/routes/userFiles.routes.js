const express = require("express");
const { getUserFiles, uploadFile } = require("../controllers/userFiles.js");


const router = express.Router();

router.post("/upload", uploadFile);
router.get("/Allfiles", getUserFiles);

module.exports = router;
