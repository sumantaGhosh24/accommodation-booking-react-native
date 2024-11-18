import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import connectDB from "./lib/connectDB.js";
import corsOptions from "./lib/corsOptions.js";
import authRouter from "./router/authRouter.js";
import userRouter from "./router/userRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import hotelRouter from "./router/hotelRouter.js";
import ratingRouter from "./router/ratingRouter.js";
import bookingRouter from "./router/bookingRouter.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/api/v1", (req, res) => {
  return res.json({message: "Accommodation Booking App REST API!"});
});

app.use("/api/v1", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", hotelRouter);
app.use("/api/v1", ratingRouter);
app.use("/api/v1", bookingRouter);

mongoose.connection.once("open", () => {
  console.log("database connection successful.");
  app.listen(PORT, () => {
    console.log(`Application listening on http://localhost:${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
