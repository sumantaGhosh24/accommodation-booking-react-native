import express from "express";

import authCtrl from "../controllers/authCtrl.js";
import loginLimiter from "../middleware/loginLimiter.js";

const router = express.Router();

router.post("/register", authCtrl.register);

router.post("/login", loginLimiter, authCtrl.login);

export default router;
