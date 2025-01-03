const express = require("express");
const router = express.Router();
const Faq = require("../../admin/models/faqcontent");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiresponse");
const {
  default: mongoose
} = require("mongoose");
const getActiveContentsByLangId = asyncHandler(async (req, res) => {
  const langid = req.params.langid;
  const {
    query
  } = req.query;
  try {
    const contents = await Faq.aggregate([{
      $match: {
        Language: langid
      }
    }, {
      $lookup: {
        from: "faqs",
        localField: "Page",
        foreignField: "_id",
        as: "Page",
        pipeline: [{
          $match: {
            Status: "STATUS_ACTIVE",
            Languages: langid
          }
        }]
      }
    }, {
      $match: {
        Page: {
          $ne: null || []
        }
      }
    }]);
    res.status(200).json(new ApiResponse(200, {
      contents
    }, "Pages fetched Successfully"));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.route("/contents/:langid").get(getActiveContentsByLangId);
module.exports = router;
//# sourceMappingURL=faq.routes.js.map