// pageController.js
const { Page, getDynamicPageModel } = require("../../models/pages/page.modal");
const asyncHandler = require("../../utils/asyncHandler");
const { default: mongoose } = require("mongoose");

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Find pages
exports.FindPages = asyncHandler(async (req, res) => {
  const type = req.query.type;

  try {
    if (type === "") {
      const result = await Page.aggregate([
        {
          $addFields: {
            publish: {
              $ifNull: ["$publish", "$createdAt"],
            },
          },
        },
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  published: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "STATUS_ACTIVE"] }, 1, 0],
                    },
                  },
                  draft: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "STATUS_INACTIVE"] }, 1, 0],
                    },
                  },
                  all: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  published: 1,
                  draft: 1,
                  all: 1,
                },
              },
            ],
            activePages: [
              {
                $project: {
                  _id: 1,
                  category: 1,
                  subcategory: 1,
                  pagestyle: 1,
                  cardstyle: 1,
                  status: 1,
                  publish: 1,
                  title: 1,
                  Languages: 1,
                },
              },
            ],
          },
        },
      ]);
      res.json({
        totals: result[0].totals[0] || {
          totalActive: 0,
          totalDraft: 0,
        },
        activePages: result[0].activePages,
      });
    } else {
      const result = await Page.aggregate([
        {
          $addFields: {
            publish: {
              $ifNull: ["$publish", "$createdAt"],
            },
          },
        },
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  published: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "STATUS_ACTIVE"] }, 1, 0],
                    },
                  },
                  draft: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "STATUS_INACTIVE"] }, 1, 0],
                    },
                  },
                  all: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  published: 1,
                  draft: 1,
                  all: 1,
                },
              },
            ],
            activePages: [
              {
                $match: { status: type },
              },
              {
                $project: {
                  _id: 1,
                  category: 1,
                  subcategory: 1,
                  pagestyle: 1,
                  cardstyle: 1,
                  status: 1,
                  publish: 1,
                  title: 1,
                  Languages: 1,
                },
              },
            ],
          },
        },
      ]);
      res.json({
        totals: result[0].totals[0] || {
          totalActive: 0,
          totalDraft: 0,
        },
        activePages: result[0].activePages,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get page by ID
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $addFields: {
          publish: {
            $ifNull: ["$publish", "$createdAt"],
          },
        },
      },
    ]);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getPageByLanguage = async (req, res) => {
  try {
    const Pages = await Page.findOne({
      Page: req.params.id,
      Language: req.params.language,
    });
    if (!Pages) {
      return res.status(201).json({ message: "Not Found" });
    }
    res.Pages = Pages;
    res.status(200).json(res.Pages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createPage = async (req, res) => {
  const { category, ...pageData } = req.body;

  try {
    if (!category) {
      return res.status(400).json({ message: "Category is required." });
    }

    // Get the dynamic model for the category
    const DynamicPageModel = getDynamicPageModel(category);

    // Create a new page document for the static collection
    const newPage = new Page({ category, ...pageData });

    // Save the page in the static collection first to get the generated ID
    const savedPage = await newPage.save();

    // Create a new page in the dynamic collection using the same ID
    const dynamicPage = new DynamicPageModel({
      _id: savedPage._id, // Use the same ID from the saved static page
      category,
      ...pageData,
    });

    // Save the page in the dynamic collection
    await dynamicPage.save();

    res.status(201).json({
      success: true,
      message: "Page saved successfully in both collections",
      // staticPage: savedPage,
      // dynamicPage: dynamicPage,
      savedPage,
    });
  } catch (err) {
    console.error("Error creating page:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Multiple pages by ID
exports.deletePages = async (req, res) => {
  try {
    const pageIds = req.body; // Expecting an array of page IDs

    console.log("🚀 Deleting Pages:", pageIds);

    // ✅ Validate Input
    if (!Array.isArray(pageIds) || pageIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid page IDs provided" });
    }

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((c) => c.name);

    const deletionPromises = pageIds.map(async (pageId) => {
      try {
        // ✅ Validate each ID
        if (!mongoose.Types.ObjectId.isValid(pageId)) {
          console.warn(`⚠️ Skipping invalid page ID: ${pageId}`);
          return;
        }

        let foundCategory = null;

        // ✅ Step 1: Check in Static Collection (pages)
        let staticPage = await Page.findById(pageId);
        if (staticPage) {
          foundCategory = staticPage.category;
        }

        // ✅ Step 2: Check in Dynamic Collections if not found
        if (!foundCategory) {
          for (const collectionName of collectionNames) {
            const DynamicPageModel = getDynamicPageModel(collectionName);
            const dynamicPage = await DynamicPageModel.findById(pageId);
            if (dynamicPage) {
              foundCategory = collectionName;
              break;
            }
          }
        }

        // ✅ Step 3: If No Matching Page Found, Skip Deletion
        if (!foundCategory) {
          console.warn(`⚠️ Page ID ${pageId} not found in any collection`);
          return;
        }

        // ✅ Step 4: Delete from Static Collection (if exists)
        if (staticPage) {
          await Page.findByIdAndDelete(pageId);
          console.log(`✅ Deleted from pages collection: ${pageId}`);
        }

        // ✅ Step 5: Delete from Dynamic Collection (if exists)
        if (foundCategory) {
          const DynamicPageModel = getDynamicPageModel(foundCategory);
          await DynamicPageModel.findByIdAndDelete(pageId);
          console.log(
            `✅ Deleted from dynamic category collection: ${foundCategory}`
          );
        }
      } catch (error) {
        console.error(`🔥 Error deleting page ID ${pageId}:`, error.message);
      }
    });

    // ✅ Wait for all deletions to complete
    await Promise.all(deletionPromises);

    // ✅ Step 6: Send Response
    res.status(200).json({
      success: true,
      message: "Pages deleted successfully from both collections.",
    });
  } catch (err) {
    console.error("🔥 Error deleting pages:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page ID format. Must be a 24-character hex string.",
      });
    }

    let foundCategory = null;

    // ✅ Step 1: Check in Static Collection (pages)
    const staticPage = await Page.findById(id);
    if (staticPage) {
      foundCategory = staticPage.category;
      await Page.findByIdAndDelete(id); // ✅ Delete from static collection
    }

    // ✅ Step 2: If Not Found in Static Collection, Search Dynamic Collections
    if (!foundCategory) {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      for (const collection of collections) {
        const categoryName = collection.name;
        const DynamicPageModel = getDynamicPageModel(categoryName);

        // ✅ Check if page exists in dynamic collection
        const dynamicPage = await DynamicPageModel.findById(id);
        if (dynamicPage) {
          foundCategory = categoryName;
          break;
        }
      }
    }

    // ✅ Step 3: Delete from Dynamic Collection if Found
    if (foundCategory) {
      const DynamicPageModel = getDynamicPageModel(foundCategory);
      const deleteResult = await DynamicPageModel.findByIdAndDelete(id);

      if (!deleteResult) {
        console.warn(
          `⚠️ Page not found in dynamic collection: ${foundCategory}`
        );
      }
    }

    // ✅ Step 4: Send Response
    res.status(200).json({
      success: true,
      message: "Page deleted successfully from both collections.",
    });
  } catch (err) {
    console.error("🔥 Error deleting page:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page ID format. Must be a 24-character hex string.",
      });
    }

    let foundCategory = null;
    let updatedStaticPage = null;
    let updatedDynamicPage = null;

    // ✅ Step 1: Check in Static Collection
    const staticPage = await Page.findById(id);
    if (staticPage) {
      foundCategory = staticPage.category;
      staticPage.set(req.body);
      updatedStaticPage = await staticPage.save();
    }

    // ✅ Step 2: Check in Dynamic Collections if not found in Static
    if (!foundCategory) {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      for (const collection of collections) {
        const categoryName = collection.name;
        const DynamicPageModel = getDynamicPageModel(categoryName);

        // ✅ Check if page exists in dynamic collection
        const dynamicPage = await DynamicPageModel.findById(id);
        if (dynamicPage) {
          foundCategory = categoryName;
          break;
        }
      }
    }

    // ✅ Step 3: Update in Dynamic Collection if Found
    if (foundCategory) {
      const DynamicPageModel = getDynamicPageModel(foundCategory);
      let dynamicPage = await DynamicPageModel.findById(id);
      if (dynamicPage) {
        dynamicPage.set(req.body);
        updatedDynamicPage = await dynamicPage.save();
      } else {
        console.warn(
          `⚠️ Page found in static but not in dynamic: ${foundCategory}`
        );
      }
    }

    // ✅ Step 4: Send Response
    if (!updatedStaticPage && !updatedDynamicPage) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found in any collection" });
    }

    res.status(200).json({
      success: true,
      message: "Page updated successfully in both collections.",
      updatedPage: updatedStaticPage || updatedDynamicPage,
    });
  } catch (err) {
    console.error("🔥 Error updating page:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getPageAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24 || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid page ID format. Ensure it's a 24-character hex string.",
      });
    }

    // Try to find the page in the static collection first
    let staticPage = await Page.findById(id).select(
      "category Availability defaultLanguage pagestyle"
    );
    let foundCategory = null;

    if (staticPage) {
      foundCategory = staticPage.category;
    } else {
      // If not found in static, check dynamic collections
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      for (const collection of collections) {
        const categoryName = collection.name;
        const DynamicPageModel = getDynamicPageModel(categoryName);
        const dynamicPage = await DynamicPageModel.findById(id).select(
          "Availability defaultLanguage pagestyle"
        );

        if (dynamicPage) {
          foundCategory = categoryName;
          staticPage = dynamicPage; // Store the dynamic page data
          break;
        }
      }
    }

    // If page is still not found, return an error
    if (!foundCategory) {
      return res.status(404).json({
        success: false,
        message: "Page not found in any category",
      });
    }

    // Merge data (staticPage now holds the page from the correct collection)
    const pageAvailability = {
      _id: staticPage._id,
      Availability: staticPage.Availability || [],
      defaultLanguage: staticPage.defaultLanguage || "",
      pagestyle: staticPage.pagestyle || "",
    };

    res.status(200).json({ success: true, pageAvailability });
  } catch (error) {
    console.error("Error fetching page availability:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.UpdatePageAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { Availability, defaultLanguage } = req.body;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page ID format. Must be a 24-character hex string.",
      });
    }

    let foundCategory = null;
    let updatedStaticPage = null;
    let updatedDynamicPage = null;

    // ✅ Step 1: Check in Static Collection
    const staticPage = await Page.findById(id);
    if (staticPage) {
      foundCategory = staticPage.category;
      staticPage.Availability = Availability;
      staticPage.defaultLanguage = defaultLanguage;
      updatedStaticPage = await staticPage.save();
    }

    // ✅ Step 2: Check in Dynamic Collections if not found in Static
    if (!foundCategory) {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      for (const collection of collections) {
        const categoryName = collection.name;
        const DynamicPageModel = getDynamicPageModel(categoryName);

        // ✅ Check if page exists in the dynamic collection
        const dynamicPage = await DynamicPageModel.findById(id);
        if (dynamicPage) {
          foundCategory = categoryName;
          break;
        }
      }
    }

    // ✅ Step 3: Update in Dynamic Collection if Found
    if (foundCategory) {
      const DynamicPageModel = getDynamicPageModel(foundCategory);
      let dynamicPage = await DynamicPageModel.findById(id);
      if (dynamicPage) {
        dynamicPage.Availability = Availability;
        dynamicPage.defaultLanguage = defaultLanguage;
        updatedDynamicPage = await dynamicPage.save();
      } else {
        console.warn(
          `⚠️ Page found in static but not in dynamic: ${foundCategory}`
        );
      }
    }

    // ✅ Step 4: Send Response
    if (!updatedStaticPage && !updatedDynamicPage) {
      return res.status(404).json({
        success: false,
        message: "Page not found in any collection",
      });
    }

    res.status(200).json({
      success: true,
      message: "Page availability updated successfully in both collections.",
      updatedPage: updatedStaticPage || updatedDynamicPage,
    });
  } catch (error) {
    console.error("🔥 Error updating page availability:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
