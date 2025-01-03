const express = require("express");
const router = express.Router();
const Donation = require("../../admin/models/donation.page");
const DonationContent = require("../../admin/models/donation");
const asyncHandler = require("../utils/asyncHandler");
const verifyJWT = require("../middleware/verifyjwt");
const {
  ObjectId
} = require("mongodb");
const ApiResponse = require("../utils/apiresponse");
const {
  default: mongoose
} = require("mongoose");
const Invoice = require("../models/users/invoice");
const currentDate = new Date();
const getActiveContentsByLangId = asyncHandler(async (req, res) => {
  const langid = req.params.langid;
  try {
    const currentDate = new Date(); // Ensure currentDate is defined

    const contents = await Donation.aggregate([{
      $match: {
        status: "STATUS_ACTIVE",
        $or: [{
          publish: {
            $lt: currentDate
          }
        }, {
          publish: null
        }]
      }
    }, {
      $addFields: {
        availableLanguages: {
          $map: {
            input: {
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
            },
            as: "lang",
            in: "$$lang.k" // Extract the language key
          }
        }
      }
    }, {
      $match: {
        $expr: {
          $gt: [{
            $size: "$availableLanguages"
          }, 0]
        }
      }
    }, {
      $addFields: {
        availableLanguage: {
          $cond: [{
            $in: [langid, "$availableLanguages"]
          }, langid, {
            $cond: [{
              $in: ["$defaultLanguage", "$availableLanguages"]
            }, "$defaultLanguage", {
              $first: "$availableLanguages"
            }]
          }]
        }
      }
    }, {
      $lookup: {
        from: "wishlists",
        localField: "_id",
        foreignField: "item",
        as: "favr"
      }
    }, {
      $addFields: {
        favr: {
          $cond: {
            if: {
              $in: [req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null, "$favr.user"]
            },
            then: true,
            else: false
          }
        }
      }
    }, {
      $lookup: {
        from: "donationcontents",
        localField: "_id",
        foreignField: "Page",
        as: "content",
        let: {
          availableLanguage: "$availableLanguage"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$Language", "$$availableLanguage"]
            } // Use the variable in the match condition
          }
        }]
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
const makeDonationInvoice = asyncHandler(async (req, res) => {
  const invoice = new Invoice({
    status: "SUCCESS",
    donationId: req.body.donationId,
    user: req.body.userId,
    amount: req.body.amount,
    paymentType: req.body.paymentType
  });
  try {
    const newInvoice = await invoice.save();
    res.status(200).json(newInvoice);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});
const getUserInvoices = asyncHandler(async (req, res) => {
  try {
    const invoices = await Invoice.find({
      user: req.user._id
    });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});
const getDonationContent = asyncHandler(async (req, res) => {
  try {
    const contents = await DonationContent.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $lookup: {
        from: "donations",
        localField: "Page",
        foreignField: "_id",
        as: "Page",
        pipeline: [{
          $lookup: {
            from: "wishlists",
            localField: "_id",
            foreignField: "item",
            as: "favr"
          }
        }, {
          $addFields: {
            favr: {
              $cond: {
                if: {
                  $in: [req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null, "$favr.user"]
                },
                then: true,
                else: false
              }
            }
          }
        }]
      }
    }, {
      $addFields: {
        Page: {
          $first: "$Page" // Use $Page to reference the array
        }
      }
    }]);
    res.status(200).json(new ApiResponse(200, contents[0], "Donation Content fetched Successfully"));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.route("/contents/:langid").get(getActiveContentsByLangId);
router.route("/donation-history").get(getUserInvoices);
router.route("/donate/invoice").post(makeDonationInvoice);
router.route("/content/:id").get(getDonationContent);
module.exports = router;
//# sourceMappingURL=donation.routes.js.map