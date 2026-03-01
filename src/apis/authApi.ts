import express from "express";
import { googleLogin, setUsername } from "../controller/authController";
const router = express.Router();
router.post("/google", googleLogin);
router.post("/set-username", setUsername);
export default router;
