import express from "express";
import { Logout, google } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/google", google);
router.post("/logout", Logout);

export default router;
