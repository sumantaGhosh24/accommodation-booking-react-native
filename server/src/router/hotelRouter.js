import express from "express";

import hotelCtrl from "../controllers/hotelCtrl.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/p-hotels", hotelCtrl.getPaginatedHotels);

router.get("/hotels", hotelCtrl.getHotels);

router.post("/hotel", authAdmin, hotelCtrl.createHotel);

router
  .route("/hotel/:id")
  .get(hotelCtrl.getHotel)
  .put(authAdmin, hotelCtrl.updateHotel)
  .delete(authAdmin, hotelCtrl.deleteHotel);

router.patch("/add-image/:id", authAdmin, hotelCtrl.addImage);

router.patch("/remove-image/:id", authAdmin, hotelCtrl.removeImage);

export default router;
