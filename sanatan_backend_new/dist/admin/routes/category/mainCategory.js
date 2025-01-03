const express = require("express");
const router = express.Router();
const Maincat = require("../../models/category/mainCategory.model");
router.get("/", async (req, res) => {
  try {
    const maincategory = await Maincat.find();
    res.status(201).json(maincategory);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.post("/add", async (req, res) => {
  try {
    const cat = await Maincat.create(req.body);
    res.status(200).json(cat);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const cat = await Maincat.findByIdAndUpdate(_id, req.body);
    res.status(200).json("Success");
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/:id", getcat, (req, res) => {
  res.json(res.maincategory);
});
async function getcat(req, res, next) {
  try {
    const maincategory = await Maincat.findById(req.params.id);
    if (maincategory == "") {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.maincategory = maincategory;
    res.json(res.maincategory);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const CatDelete = await Maincat.deleteOne({
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
//# sourceMappingURL=mainCategory.js.map