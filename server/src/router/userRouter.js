import express from "express";

import userCtrl from "../controllers/userCtrl.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.put("/user-image", auth, userCtrl.userImage);

router.put("/user-data", auth, userCtrl.userData);

router.put("/user-address", auth, userCtrl.userAddress);

router.post("/reset-password", auth, userCtrl.resetPassword);

router.get("/users", authAdmin, userCtrl.getUsers);

router.get("/me", auth, userCtrl.getMe);

export default router;
