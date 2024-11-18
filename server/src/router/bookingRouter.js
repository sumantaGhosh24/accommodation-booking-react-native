import express from "express";

import bookingCtrl from "../controllers/bookingCtrl.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/booking", auth, bookingCtrl.getUserBooking);

router.put("/booking", authAdmin, bookingCtrl.updateBooking);

router.get("/bookings", authAdmin, bookingCtrl.getBookings);

router.get("/hotel-booking/:hotel", auth, bookingCtrl.getHotelBooking);

router.post("/razorpay", auth, bookingCtrl.getRazorpay);

router.post("/verification", auth, bookingCtrl.verification);

export default router;
