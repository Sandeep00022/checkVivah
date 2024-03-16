import express from "express";
import { getUserFiles, uploadFile } from "../controllers/userFiles.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/upload",verifyToken, uploadFile);
router.get("/Allfiles",verifyToken, getUserFiles)

export default router;