import express from "express";

import categoryCtrl from "../controllers/categoryCtrl.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router
  .route("/category")
  .get(categoryCtrl.getCategories)
  .post(authAdmin, categoryCtrl.createCategory);

router
  .route("/category/:id")
  .get(categoryCtrl.getCategory)
  .delete(authAdmin, categoryCtrl.deleteCategory)
  .put(authAdmin, categoryCtrl.updateCategory);

export default router;
