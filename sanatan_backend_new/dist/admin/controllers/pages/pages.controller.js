// pageController.js
const Page = require("../../models/pages/page.modal");
const Aartis = require("../../models/pages/aarti");
const Temples = require("../../models/pages/temples");
const Scriptures = require("../../models/pages/scriptures");
const Scriptures2 = require("../../models/pages/sricptures2");
const Extras = require("../../models/pages/extra");
const Blogs = require("../../models/pages/pageblog");
const asyncHandler = require("../../utils/asyncHandler");
const {
  default: mongoose
} = require("mongoose");

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
// Find pages
exports.FindPages = asyncHandler(async (req, res) => {
  const type = req.query.type;
  try {
    if (type === "") {
      const result = await Page.aggregate([{
        $addFields: {
          publish: {
            $ifNull: ["$publish", "$createdAt"]
          }
        }
      }, {
        $facet: {
          totals: [{
            $group: {
              _id: null,
              published: {
                $sum: {
                  $cond: [{
                    $eq: ["$status", "STATUS_ACTIVE"]
                  }, 1, 0]
                }
              },
              draft: {
                $sum: {
                  $cond: [{
                    $eq: ["$status", "STATUS_INACTIVE"]
                  }, 1, 0]
                }
              },
              all: {
                $sum: 1
              }
            }
          }, {
            $project: {
              _id: 0,
              published: 1,
              draft: 1,
              all: 1
            }
          }],
          activePages: [{
            $project: {
              _id: 1,
              category: 1,
              subcategory: 1,
              pagestyle: 1,
              cardstyle: 1,
              status: 1,
              publish: 1,
              title: 1,
              Languages: 1
            }
          }]
        }
      }]);
      res.json({
        totals: result[0].totals[0] || {
          totalActive: 0,
          totalDraft: 0
        },
        activePages: result[0].activePages
      });
    } else {
      const result = await Page.aggregate([{
        $addFields: {
          publish: {
            $ifNull: ["$publish", "$createdAt"]
          }
        }
      }, {
        $facet: {
          totals: [{
            $group: {
              _id: null,
              published: {
                $sum: {
                  $cond: [{
                    $eq: ["$status", "STATUS_ACTIVE"]
                  }, 1, 0]
                }
              },
              draft: {
                $sum: {
                  $cond: [{
                    $eq: ["$status", "STATUS_INACTIVE"]
                  }, 1, 0]
                }
              },
              all: {
                $sum: 1
              }
            }
          }, {
            $project: {
              _id: 0,
              published: 1,
              draft: 1,
              all: 1
            }
          }],
          activePages: [{
            $match: {
              status: type
            }
          }, {
            $project: {
              _id: 1,
              category: 1,
              subcategory: 1,
              pagestyle: 1,
              cardstyle: 1,
              status: 1,
              publish: 1,
              title: 1,
              Languages: 1
            }
          }]
        }
      }]);
      res.json({
        totals: result[0].totals[0] || {
          totalActive: 0,
          totalDraft: 0
        },
        activePages: result[0].activePages
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Get page by ID
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $addFields: {
        publish: {
          $ifNull: ["$publish", "$createdAt"]
        }
      }
    }]);
    if (!page) {
      return res.status(404).json({
        message: "Page not found"
      });
    }
    res.json(page[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
exports.getPageByLanguage = async (req, res) => {
  try {
    const Pages = await Page.findOne({
      Page: req.params.id,
      Language: req.params.language
    });
    if (!Pages) {
      return res.status(201).json({
        message: "Not Found"
      });
    }
    res.Pages = Pages;
    res.status(200).json(res.Pages);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
exports.getPageAvailability = async (req, res) => {
  try {
    const Pages = await Page.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $project: {
        Availability: {
          $ifNull: ["$Availability", []]
        },
        defaultLanguage: 1,
        pagestyle: 1
      }
    }]);
    if (!Pages) {
      return res.status(201).json({
        message: "Not Found"
      });
    }
    res.Pages = Pages;
    res.status(200).json(res.Pages);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
exports.UpdatePageAvailability = async (req, res) => {
  try {
    const Pages = await Page.findByIdAndUpdate(req.params.id, {
      $set: {
        Availability: req.body.Availability,
        defaultLanguage: req.body.defaultLanguage
      }
    });
    if (!Pages) {
      return res.status(201).json({
        message: "Not Found"
      });
    }
    res.Pages = Pages;
    res.status(200).json(res.Pages);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
// Create a new page
exports.createPage = async (req, res) => {
  const page = new Page(req.body);
  try {
    const newPage = await page.save();
    res.status(201).json(newPage);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Update page by ID
exports.updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({
        message: "Page not found"
      });
    }
    page.set(req.body);
    const updatedPage = await page.save();
    res.json(updatedPage);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Delete page by ID
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({
        message: "Page not found"
      });
    }
    if (page.pagestyle === "aarti") {
      await Aartis.deleteMany({
        Page: req.params.id
      });
    }
    if (page.pagestyle === "scripture") {
      await Scriptures.deleteMany({
        Page: req.params.id
      });
    }
    if (page.pagestyle === "scripture2") {
      await Scriptures2.deleteMany({
        Page: req.params.id
      });
    }
    if (page.pagestyle === "blog") {
      await Blogs.deleteMany({
        Page: req.params.id
      });
    }
    if (page.pagestyle === "temple") {
      await Temples.deleteMany({
        Page: req.params.id
      });
    }
    if (page.pagestyle === "extra") {
      await Extras.deleteMany({
        Page: req.params.id
      });
    }
    await Page.findByIdAndDelete(req.params.id);
    res.json({
      message: "Page deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Delete Multiple pages by ID
exports.deletePages = async (req, res) => {
  try {
    var ids = req.body;
    ids.forEach(async element => {
      const page = await Page.findById(element);
      if (page) {
        if (page.pagestyle === "aarti") {
          await Aartis.deleteMany({
            Page: element
          });
        }
        if (page.pagestyle === "scripture") {
          await Scriptures.deleteMany({
            Page: element
          });
        }
        if (page.pagestyle === "scripture2") {
          await Scriptures2.deleteMany({
            Page: element
          });
        }
        if (page.pagestyle === "blog") {
          await Blogs.deleteMany({
            Page: element
          });
        }
        if (page.pagestyle === "temple") {
          await Temples.deleteMany({
            Page: element
          });
        }
        if (page.pagestyle === "extra") {
          await Extras.deleteMany({
            Page: element
          });
        }
        await Page.findByIdAndDelete(element);
      }
    });
    res.json({
      message: "Pages deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
//# sourceMappingURL=pages.controller.js.map