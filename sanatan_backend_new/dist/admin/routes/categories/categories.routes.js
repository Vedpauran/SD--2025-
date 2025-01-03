// routes.js

const express = require("express");
const router = express.Router();
const innercategoryController = require("../../controllers/categories/innerCategory.controller");
const maincategoryController = require("../../controllers/categories/mainCategory.controller");
const subcategoryController = require("../../controllers/categories/subCategory.controller");
router.get("/categories/inner", innercategoryController.getAllCategories); //all categories
router.get("/categories/inner/:id", innercategoryController.getCategoryById); // category by id

router.post("/categories/inner", innercategoryController.createCategory); //create categories
router.put("/categories/inner/:id", innercategoryController.updateCategory); //update categories
router.delete("/categories/inner/:id", innercategoryController.deleteCategory); //delete categories

router.get("/categories/main", maincategoryController.getAllCategories); //all categories

// router.get(
// 	"/categories/main",
// 	categoriesController.getAllmainCategories
// )
router.get("/categories/in/:categoryin", maincategoryController.getCategoriesByPage); //all categories by page
router.get("/categories/main/find", maincategoryController.FindCategory); //all categories
router.get("/categories/main/:id", maincategoryController.getCategoryById); // category by id

router.post("/categories/main", maincategoryController.createCategory); //create categories
router.put("/categories/main/:id", maincategoryController.updateCategory); //update categories
router.delete("/categories/main/:id", maincategoryController.deleteCategory); //delete categories

router.get("/categories/sub/find/:id", subcategoryController.getAllCategories); //all categories
router.get("/categories/sub/find/:id/type", subcategoryController.FindCategory); //all categories
router.get("/categories/sub/:id", subcategoryController.getCategoryById); // category by id

router.post("/categories/sub", subcategoryController.createCategory); //create categories
router.put("/categories/sub/:id", subcategoryController.updateCategory); //update categories
router.delete("/categories/sub/:id", subcategoryController.deleteCategory); //delete categories

module.exports = router;
//# sourceMappingURL=categories.routes.js.map