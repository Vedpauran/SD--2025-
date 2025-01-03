const express = require("express");
const router = express.Router();
const SocialMedia = require("../../admin/models/social");
const asyncHandler = require("../utils/asyncHandler");
const {
  ObjectId
} = require("mongodb");
router.get("/", asyncHandler(async (req, res) => {
  try {
    const sociallist = await SocialMedia.find();
    res.status(200).json(sociallist);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}));
module.exports = router;
//# sourceMappingURL=socialmedia.routes.js.map