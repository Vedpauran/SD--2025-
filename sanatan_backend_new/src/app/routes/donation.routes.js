const express = require("express");
const router = express.Router();
const Donation = require("../../admin/models/donation.page");
const DonationContent = require("../../admin/models/donation");
const asyncHandler = require("../utils/asyncHandler");
const verifyJWT = require("../middleware/verifyjwt");
const { ObjectId } = require("mongodb");
const ApiResponse = require("../utils/apiresponse");
const { default: mongoose } = require("mongoose");
const Invoice = require("../models/users/invoice");

// ✅ Get active donation contents by language ID
const getActiveContentsByLangId = asyncHandler(async (req, res) => {
  const langid = req.params.langid;

  try {
    const currentDate = new Date(); // Ensure currentDate is defined

    const contents = await Donation.aggregate([
      {
        $match: {
          status: "STATUS_ACTIVE",
          $or: [{ publish: { $lt: currentDate } }, { publish: null }],
        },
      },
      {
        $addFields: {
          availableLanguages: {
            $map: {
              input: {
                $filter: {
                  input: { $objectToArray: { $ifNull: ["$Availability", {}] } }, // ✅ Ensure Availability is not null
                  cond: {
                    $and: [
                      { $eq: ["$$this.v.checked", true] },
                      { $eq: ["$$this.v.value", "Available"] },
                    ],
                  },
                },
              },
              as: "lang",
              in: "$$lang.k",
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $gt: [{ $size: { $ifNull: ["$availableLanguages", []] } }, 0],
          }, // ✅ Ensure it's always an array
        },
      },
      {
        $addFields: {
          availableLanguage: {
            $cond: [
              { $in: [langid, "$availableLanguages"] },
              langid,
              {
                $cond: [
                  {
                    $in: ["$defaultLanguage", "$availableLanguages"],
                  },
                  "$defaultLanguage",
                  { $first: "$availableLanguages" },
                ],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "wishlists",
          localField: "_id",
          foreignField: "item",
          as: "favr",
        },
      },
      {
        $addFields: {
          favr: {
            $cond: {
              if: {
                $in: [
                  req.user?._id
                    ? new mongoose.Types.ObjectId(req.user._id)
                    : null,
                  "$favr.user",
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "donationcontents",
          let: { availableLanguage: "$availableLanguage" }, // ✅ Define variable correctly
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$Language", "$$availableLanguage"], // ✅ Correct reference
                },
              },
            },
          ],
          as: "content",
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiResponse(200, { contents }, "Pages fetched Successfully"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create a donation invoice
const makeDonationInvoice = asyncHandler(async (req, res) => {
  try {
    const { donationId, userId, amount, paymentType } = req.body;

    if (!donationId || !userId || !amount || !paymentType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const invoice = new Invoice({
      status: "SUCCESS",
      donationId,
      user: userId,
      amount,
      paymentType,
    });

    const newInvoice = await invoice.save();
    res.status(200).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get user's donation invoices
const getUserInvoices = asyncHandler(async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const invoices = await Invoice.find({ user: req.user._id });

    res.status(200).json(invoices);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get donation content by ID
const getDonationContent = asyncHandler(async (req, res) => {
  try {
    const contents = await DonationContent.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "donations",
          localField: "Page",
          foreignField: "_id",
          as: "Page",
          pipeline: [
            {
              $lookup: {
                from: "wishlists",
                localField: "_id",
                foreignField: "item",
                as: "favr",
              },
            },
            {
              $addFields: {
                favr: {
                  $cond: {
                    if: {
                      $in: [
                        req.user?._id
                          ? new mongoose.Types.ObjectId(req.user._id)
                          : null,
                        "$favr.user",
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          Page: {
            $first: "$Page", // Use $Page to reference the array
          },
        },
      },
    ]);
    res.status(200).json(
      new ApiResponse(
        200,

        contents,

        "Donation Content fetched Successfully"
      )
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Routes
router.route("/contents/:langid").get(getActiveContentsByLangId);

router.route("/donation-history").get(verifyJWT, getUserInvoices);
router.route("/donate/invoice").post(verifyJWT, makeDonationInvoice);
router.route("/content/:id").get(getDonationContent);

module.exports = router;
