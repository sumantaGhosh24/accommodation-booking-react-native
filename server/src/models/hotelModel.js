import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    price: {
      type: Number,
      required: true,
    },
    booked: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true}
);

hotelSchema.index({
  title: "text",
  description: "text",
  content: "text",
  price: "text",
});

const Hotel = mongoose.model("Hotel", hotelSchema);

Hotel.createIndexes({
  title: "text",
  description: "text",
  content: "text",
  price: "text",
});

export default Hotel;
