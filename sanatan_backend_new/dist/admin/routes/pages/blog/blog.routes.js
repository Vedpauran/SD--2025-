// routes.js

const express = require("express");
const router = express.Router();
const blogController = require("../../../controllers/pages/blog/blog.controller");
router.get("/", blogController.getAllBlogs); //all blog
router.get("/:id", blogController.getBlogById); // blog by id
router.get("/:id/:language", blogController.getBlogByLanguage); // blog
router.get("/trash", blogController.getTrashBlogs); //all trash blog
router.get("/active", blogController.getActiveBlogs); //all active blog
router.get("/draft", blogController.getDraftBlogs); //all draft blog
router.post("/", blogController.createBlog); //create blog
router.put("/:id", blogController.updateBlog); //update blog
router.delete("/:id", blogController.deleteBlog); //delete blog

module.exports = router;
//# sourceMappingURL=blog.routes.js.map