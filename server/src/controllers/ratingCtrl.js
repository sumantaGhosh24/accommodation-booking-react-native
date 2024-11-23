import Rating from "../models/ratingModel.js";

const ratingCtrl = {
  getAllRatings: async (req, res) => {
    try {
      const ratings = await Rating.find()
        .populate("hotel", "title _id")
        .populate("user", "firstName lastName username email image");
      if (!ratings)
        return res.json({message: "No rating exists.", success: false});

      return res.json({ratings, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getRatings: async (req, res) => {
    try {
      const ratings = await Rating.find({hotel: req.params.hotel}).populate(
        "user",
        "firstName lastName username email image"
      );
      if (!ratings)
        return res.json({message: "No rating exists.", success: false});

      return res.json({ratings, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getMyRatings: async (req, res) => {
    try {
      const ratings = await Rating.find({user: req.user._id})
        .populate("user", "firstName lastName username email image")
        .populate("hotel", "title image");
      if (!ratings)
        return res.json({message: "No rating exists.", success: false});

      return res.json({ratings, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  createRating: async (req, res) => {
    try {
      const {comment, rating} = req.body;
      const hotel = req.params.hotel;
      const user = req.user._id;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) return res.json({message: errors, success: false});

      const newRating = new Rating({
        hotel,
        user,
        comment: comment.toLowerCase(),
        rating: Number(rating),
      });
      await newRating.save();

      return res.json({message: "Rating created successful.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
};

export default ratingCtrl;
