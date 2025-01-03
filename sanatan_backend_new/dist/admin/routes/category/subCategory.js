const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../../models/category/subCategory.model");
const mainCategory = require("../../models/category/mainCategory.model");
const Subcategory = require("../../models/category/subCategory.model");
const {
  ObjectId
} = require("mongodb");
router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/find/:main", async (req, res) => {
  try {
    const id = req.params.main;
    const category = await Subcategory.aggregate([{
      $match: {
        Parent: new ObjectId(id)
      }
    }, {
      $lookup: {
        from: "maincategories",
        localField: "Parent",
        foreignField: "_id",
        as: "mainCategory"
      }
    }]);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.post("/add", async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(200).json(cat);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const UpdateCategory = await Category.findByIdAndUpdate(_id, req.body);
    res.status(200).json("success");
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/:id", getcat, (req, res) => {
  res.json(res.category);
});
async function getcat(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.category = category;
    res.json(res.category);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const CatDelete = await Category.deleteOne({
      _id
    });
    res.status(200).json({
      msg: "Successfully Deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;
//# sourceMappingURL=subCategory.js.map