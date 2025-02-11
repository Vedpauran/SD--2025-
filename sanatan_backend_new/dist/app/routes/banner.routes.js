const express = require("express");
const router = express.Router();
const Banner = require("../../admin/models/hero");
const asyncHandler = require("../utils/asyncHandler");
router.get("/", asyncHandler(async (req, res) => {
  try {
    const Banners = await Banner.aggregate([{
      $match: {
        Language: langid,
        $or: [{
          publish: {
            $lt: currentDate
          }
        }, {
          publish: null
        }]
      }
    }]);
    res.status(200).json(Banners);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}));
module.exports = router;
//# sourceMappingURL=banner.routes.js.map