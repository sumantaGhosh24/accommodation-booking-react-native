import Category from "../models/categoryModel.js";
import Hotel from "../models/hotelModel.js";

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();

      return res.json({categories, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  createCategory: async (req, res) => {
    try {
      const {name, image} = req.body;
      if (!name || !image) {
        return res.json({message: "Please fill all fields.", success: false});
      }

      const category = await Category.findOne({name});
      if (category)
        return res.json({
          message: "This category already created.",
          success: false,
        });

      const newCategory = new Category({
        name: name.toLowerCase(),
        image,
      });
      await newCategory.save();

      return res.json({message: "Category created.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category)
        return res.json({message: "Category not found.", success: false});

      return res.json({category, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const hotel = await Hotel.findOne({category: req.params.id});
      if (hotel)
        return res.json({
          message: "Please delete all hotel of this category first",
          success: false,
        });

      await Category.findByIdAndDelete(req.params.id);

      return res.json({message: "Category deleted.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  updateCategory: async (req, res) => {
    try {
      const {name} = req.body;

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        {name: name.toLowerCase()},
        {new: true}
      );
      if (!category)
        return res.json({
          message: "This category does not exists.",
          success: false,
        });

      return res.json({message: "Category updated.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
};

export default categoryCtrl;
