const express = require("express");
const router = express.Router();
const { getDynamicPageModel } = require("../../admin/models/pages/page.modal");
const mongoose = require("mongoose");

// Import all page models
const Temple = require("../../admin/models/pages/temples");
const Scripture = require("../../admin/models/pages/scriptures");
const Scripture2 = require("../../admin/models/pages/sricptures2");
const Aarti = require("../../admin/models/pages/aarti");
const Blog = require("../../admin/models/pages/pageblog");
const Extra = require("../../admin/models/pages/extra");
const Table = require("../../admin/models/pages/tableStyle");

// Mapping of pagestyles to models
const pageStyleModels = {
  temple: Temple,
  scripture: Scripture,
  scripture2: Scripture2,
  aarti: Aarti,
  blog: Blog,
  extra: Extra,
  table: Table,
};

// ✅ API to Get a Single Page with Pagestyle Data
// router.get("/page/:pageId", async (req, res) => {
//   const { pageId } = req.params;

//   try {
//     // Validate Page ID format
//     if (!mongoose.Types.ObjectId.isValid(pageId)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid page ID format" });
//     }

//     // ✅ Fetch all collections dynamically
//     const collections = await mongoose.connection.db
//       .listCollections()
//       .toArray();
//     let page = null;
//     let categoryName = null;
//     let pagestyle = null;

//     for (const collection of collections) {
//       const category = collection.name;
//       const DynamicPageModel = getDynamicPageModel(category);
//       if (!DynamicPageModel) continue;

//       // Search for the page in this category
//       page = await DynamicPageModel.findById(pageId);
//       if (page) {
//         categoryName = category;
//         pagestyle = page.pagestyle ? page.pagestyle.toLowerCase() : null; // Ensure case insensitivity
//         break;
//       }
//     }

//     // If no page is found, return 404
//     if (!page) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Page not found in any category" });
//     }

//     // console.log("Found page in category:", categoryName);
//     // console.log("Page Pagestyle:", pagestyle);

//     // ✅ Fetch related pagestyle data if available
//     let pagestyleData = null;
//     if (pagestyle && pageStyleModels[pagestyle]) {
//       const PageStyleModel = pageStyleModels[pagestyle];

//       // 🔹 Debug: Check if the correct model is being used
//       //   console.log("Using model:", pagestyle);

//       // ✅ Try multiple field names to find the correct one
//       pagestyleData = await PageStyleModel.findOne({
//         $or: [
//           { pageId: new mongoose.Types.ObjectId(page._id) }, // Standard reference
//           { Page: new mongoose.Types.ObjectId(page._id) }, // Alternative field name
//           { _id: new mongoose.Types.ObjectId(page._id) }, // In case stored with _id
//         ],
//       });

//       // 🔹 Debug: Check if any data was fetched
//       //   console.log("Pagestyle Data Found:", pagestyleData);
//     } else {
//       console.log("No matching pagestyle model found.");
//     }

//     res.status(200).json({
//       success: true,
//       page, // The specific page data
//       pagestyleData: pagestyleData || null, // Return null if no pagestyle data
//     });
//   } catch (error) {
//     console.error("Error fetching page:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// });

router.get("/page/:pageId", async (req, res) => {
  const { pageId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid page ID format" });
    }

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    let page = null;
    let categoryName = null;
    let pagestyle = null;

    for (const collection of collections) {
      const category = collection.name;
      const DynamicPageModel = getDynamicPageModel(category);
      if (!DynamicPageModel) continue;

      page = await DynamicPageModel.findById(pageId);
      if (page) {
        categoryName = category;
        pagestyle = page.pagestyle ? page.pagestyle.toLowerCase() : null;
        break;
      }
    }

    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found in any category" });
    }

    let pagestyleData = null;
    if (pagestyle && pageStyleModels[pagestyle]) {
      const PageStyleModel = pageStyleModels[pagestyle];

      pagestyleData = await PageStyleModel.findOne({
        $or: [
          { pageId: new mongoose.Types.ObjectId(page._id) },
          { Page: new mongoose.Types.ObjectId(page._id) },
          { _id: new mongoose.Types.ObjectId(page._id) },
        ],
      });

      if (pagestyleData && Array.isArray(pagestyleData.Media)) {
        const allowedMedia = pagestyleData.Media;

        // Media type mapping (media => actual field in DB)
        const mediaFieldMap = {
          audio: { dataField: "audio", descriptionField: "audiodescription" },
          video: { dataField: "video", descriptionField: "videodescription" },
          pdf: {
            dataField: "documents",
            descriptionField: "documentsdescription",
          },
          text: null, // handled separately
        };

        const filteredPagestyleData = {
          Media: allowedMedia,
          Language: pagestyleData.Language,
          Page: pagestyleData.Page,
          _id: pagestyleData._id,
          createdAt: pagestyleData.createdAt,
          updatedAt: pagestyleData.updatedAt,
          __v: pagestyleData.__v,
        };

        // Add only allowed media fields and their descriptions
        for (const mediaType of allowedMedia) {
          const map = mediaFieldMap[mediaType];
          if (map) {
            if (pagestyleData[map.dataField] !== undefined) {
              filteredPagestyleData[map.dataField] =
                pagestyleData[map.dataField];
            }
            if (pagestyleData[map.descriptionField] !== undefined) {
              filteredPagestyleData[map.descriptionField] =
                pagestyleData[map.descriptionField];
            }
          }
        }

        // If text is in media, include text-related fields
        if (allowedMedia.includes("text")) {
          const textFields = [
            "title",
            "description",
            "innertitle",
            "innerdescription",
            "middletitle",
            "middledescription",
            "middleinfo",
          ];
          for (const field of textFields) {
            if (pagestyleData[field] !== undefined) {
              filteredPagestyleData[field] = pagestyleData[field];
            }
          }
        }

        return res.status(200).json({
          success: true,
          page,
          pagestyleData: filteredPagestyleData,
        });
      }
    }

    // Default response if no filtered data logic applied
    return res.status(200).json({
      success: true,
      page,
      pagestyleData: pagestyleData || null,
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

// router.get("/:categoryName", async (req, res) => {
//   const { categoryName } = req.params; // Extract category name from the URL
//   try {
//     // Get the dynamic model for the category
//     const DynamicPageModel = getDynamicPageModel(categoryName);

//     // Fetch pages
//     const pages = await DynamicPageModel.find();

//     // Return the pages
//     res.status(200).json({ success: true, data: pages });
//   } catch (error) {
//     console.error("Error fetching pages:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

router.get("/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  try {
    const DynamicPageModel = getDynamicPageModel(categoryName);

    // Only show pages that are published at or before now
    const pages = await DynamicPageModel.find({
      publish: { $lte: new Date() },
    });

    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
