import dotenv from "dotenv";
import crypto from "crypto";
import Razorpay from "razorpay";

import Booking from "../models/bookingModel.js";

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const bookingCtrl = {
  getUserBooking: async (req, res) => {
    try {
      const bookings = await Booking.find({user: req.user._id})
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel", "title _id");
      if (!bookings)
        return res.json({msg: "This booking does not exists.", success: false});

      return res.json({bookings, success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  updateBooking: async (req, res) => {
    try {
      const {status, id} = req.body;

      const booking = await Booking.findByIdAndUpdate(
        id,
        {status},
        {new: true}
      );
      if (!booking)
        return res.json({
          message: "This booking does not exists.",
          success: false,
        });

      return res.json({message: "Booking updated successful.", success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  getBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel", "_id title description images");

      return res.json({booking, success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel", "title _id");

      return res.json({bookings, success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  getHotelBooking: async (req, res) => {
    try {
      const bookings = await Booking.find({hotel: req.params.hotel})
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel", "title _id");
      if (!bookings)
        return res.json({msg: "This booking does not exists.", success: false});

      return res.json({bookings, success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  getRazorpay: async (req, res) => {
    try {
      const options = {
        amount: Number(req.body.price * 100),
        currency: "INR",
      };
      const order = await instance.orders.create(options);
      if (!order) return res.json({message: "server error", success: false});

      return res.json({order, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  verification: async (req, res) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        hotel,
        price,
        checkInDate,
        checkOutDate,
        numberOfDays,
        adults,
        children,
      } = req.body;
      const user = req.user._id;

      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      );

      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

      const digest = shasum.digest("hex");

      if (digest !== razorpaySignature)
        return res.json({msg: "Transaction not legit!"});

      const newBooking = new Booking({
        user: user,
        hotel: hotel,
        paymentResult: {
          id: orderCreationId,
          status: "success",
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        },
        checkInDate,
        checkOutDate,
        numberOfDays,
        adults,
        children,
        price: price,
        status: "pending",
      });
      await newBooking.save();

      res.json({
        msg: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        success: true,
      });
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
};

export default bookingCtrl;
