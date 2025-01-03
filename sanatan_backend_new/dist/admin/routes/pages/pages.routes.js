// routes.js

const express = require("express");
const router = express.Router();
const pageController = require("../../controllers/pages/pages.controller");
router.get("/", pageController.getAllPages); //all pages
router.get("/find", pageController.FindPages); //find pages
router.get("/:id", pageController.getPageById); // pages by id
router.post("/", pageController.createPage); //create pages
router.put("/:id", pageController.updatePage); //update pages
router.get("/get-availability/:id", pageController.getPageAvailability); //get pages
router.patch("/update-availability/:id", pageController.UpdatePageAvailability); //update pages
router.delete("/:id", pageController.deletePage); //delete pages
router.post("/deletemany", pageController.deletePages); //delete pages

module.exports = router;
//# sourceMappingURL=pages.routes.js.map