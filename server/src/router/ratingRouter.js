import express from "express";

import ratingCtrl from "../controllers/ratingCtrl.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/all-ratings", authAdmin, ratingCtrl.getAllRatings);

router.get("/ratings/:hotel", auth, ratingCtrl.getRatings);

router.get("/ratings", auth, ratingCtrl.getMyRatings);

router.post("/rating/:hotel", auth, ratingCtrl.createRating);

export default router;
