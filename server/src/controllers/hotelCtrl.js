import {APIFeatures} from "../lib/index.js";
import Hotel from "../models/hotelModel.js";

const hotelCtrl = {
  getPaginatedHotels: async (req, res) => {
    try {
      const features = new APIFeatures(
        Hotel.find()
          .populate("owner", "_id username email mobileNumber image")
          .populate("category", "name image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();

      const features2 = new APIFeatures(Hotel.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const hotels = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      return res.json({hotels, count, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id)
        .populate("owner", "_id username email mobileNumber image")
        .populate("category");
      if (!hotel)
        return res.json({
          message: "This hotel does not exists.",
          success: false,
        });

      return res.json({hotel, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getHotels: async (req, res) => {
    try {
      const hotels = await Hotel.find()
        .populate("owner", "_id username email mobileNumber image")
        .populate("category", "name image");

      return res.json({hotels, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  createHotel: async (req, res) => {
    try {
      const {
        title,
        description,
        content,
        images,
        category,
        price,
        country,
        city,
        zip,
        address,
        latitude,
        longitude,
        state,
      } = req.body;
      const owner = req.user._id;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        return res.json({message: errors, success: false});
      }

      const newHotel = new Hotel({
        owner: owner,
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        content: content.toLowerCase(),
        images,
        category,
        price,
        country,
        city,
        zip,
        address,
        latitude,
        longitude,
        state,
      });
      await newHotel.save();

      return res.json({
        message: "New hotel created successful.",
        success: true,
      });
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  updateHotel: async (req, res) => {
    try {
      const {
        title,
        description,
        content,
        price,
        country,
        city,
        zip,
        address,
        latitude,
        longitude,
        state,
        category,
      } = req.body;

      const hotel = await Hotel.findByIdAndUpdate(req.params.id, {
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        content: content.toLowerCase(),
        price,
        country,
        city,
        zip,
        address,
        latitude,
        longitude,
        state,
        category,
      });
      if (!hotel)
        return res.json({
          message: "This hotel does not exists.",
          success: false,
        });

      return res.json({message: "Hotel update successful.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  deleteHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!hotel)
        return res.json({
          message: "This hotel does not exists.",
          success: false,
        });

      return res.json({message: "Hotel deleted successful.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  addImage: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel)
        return res.json({message: "Hotel does not exists.", success: false});

      hotel.images = [...hotel.images, ...req.body.images];
      await hotel.save();

      return res.json({message: "Hotel image added.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  removeImage: async (req, res) => {
    try {
      const {public_id} = req.body;
      if (!public_id)
        return res.json({message: "Public id not found.", success: false});

      const hotel = await Hotel.findById(req.params.id);
      if (!hotel)
        return res.json({message: "Hotel does not exists.", success: false});

      hotel.images = hotel.images.filter((img) => img.public_id !== public_id);
      await hotel.save();

      return res.json({message: "Hotel image removed.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
};

export default hotelCtrl;
