const express = require("express");
const router = express.Router();
const Category = require("../../admin/models/category/mainCategory.model");
const asyncHandler = require("../utils/asyncHandler");
const {
  ObjectId
} = require("mongodb");
const {
  default: mongoose
} = require("mongoose");
const getActiveCategoriesByLangId = asyncHandler(async (req, res) => {
  const {
    langid
  } = req.params;
  const currentDate = new Date();
  try {
    const activeCategories = await Category.aggregate([
    // Match only active categories
    {
      $match: {
        Status: "STATUS_ACTIVE",
        CategoryIn: "Pages"
      }
    }, {
      $match: {
        $expr: {
          $eq: [`$Languages.${langid}.checked`, true]
        }
      }
    }, {
      $lookup: {
        from: "pages",
        localField: "Name",
        foreignField: "category",
        as: "pages",
        pipeline: [{
          $match: {
            status: "STATUS_ACTIVE"
          }
        }, {
          $match: {
            $or: [{
              publish: {
                $lt: currentDate
              }
            }, {
              publish: null
            }]
          }
        }, {
          $match: {
            $expr: {
              $gt: [{
                $size: {
                  $ifNull: [{
                    $filter: {
                      input: {
                        $objectToArray: "$Availability"
                      },
                      cond: {
                        $and: [{
                          $eq: ["$$this.v.checked", true]
                        }, {
                          $eq: ["$$this.v.value", "Available"]
                        }]
                      }
                    }
                  }, []]
                }
              }, 0]
            }
          }
        }]
      }
    }, {
      $addFields: {
        Count: {
          $size: {
            $ifNull: ["$pages", []]
          }
        }
      }
    },
    // Project to include only necessary fields
    {
      $project: {
        CategoryIn: 1,
        Name: 1,
        Icon: 1,
        Bannercolor: 1,
        Headfontcolor: 1,
        Colorleft: 1,
        Colorright: 1,
        Names: 1,
        Count: 1,
        categoryName: `$Languages.${langid}.value`
      }
    }]);
    res.status(200).json(activeCategories);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    });
  }
});
router.route("/main/:langid").get(getActiveCategoriesByLangId);
module.exports = router;
//# sourceMappingURL=category.routes.js.map