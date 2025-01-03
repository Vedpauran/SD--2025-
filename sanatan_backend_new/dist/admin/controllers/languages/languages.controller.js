// languageController.js
const Language = require("../../models/language");
const asyncHandler = require("../../utils/asyncHandler");
// Get all languages
exports.getAllLanguages = asyncHandler(async (req, res) => {
  try {
    const languages = await Language.aggregate([{
      $addFields: {
        Date: {
          $ifNull: ["$Date", "$createdAt"]
        }
      }
    }]);
    res.json(languages);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Get language by ID
exports.getLanguageById = asyncHandler(async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return res.status(404).json({
        message: "Language not found"
      });
    }
    res.json(language);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
exports.FindLanguages = asyncHandler(async (req, res) => {
  const type = req.query.type;
  try {
    if (type === "") {
      const result = await Language.aggregate([{
        $facet: {
          totals: [{
            $group: {
              _id: null,
              published: {
                $sum: {
                  $cond: [{
                    $eq: ["$Status", "STATUS_ACTIVE"]
                  }, 1, 0]
                }
              },
              draft: {
                $sum: {
                  $cond: [{
                    $eq: ["$Status", "STATUS_INACTIVE"]
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
          activeLanguages: [{
            $project: {
              _id: 1,
              Status: 1,
              adminName: 1,
              Name: 1,
              Icon: 1,
              Date: {
                $ifNull: ["$Date", "$createdAt"]
              }
            }
          }]
        }
      }]);
      res.json({
        totals: result[0].totals[0] || {
          totalActive: 0,
          totalDraft: 0
        },
        activeLanguages: result[0].activeLanguages
      });
    } else {
      const result = await Language.aggregate([{
        $facet: {
          totals: [{
            $group: {
              _id: null,
              published: {
                $sum: {
                  $cond: [{
                    $eq: ["$Status", "STATUS_ACTIVE"]
                  }, 1, 0]
                }
              },
              draft: {
                $sum: {
                  $cond: [{
                    $eq: ["$Status", "STATUS_INACTIVE"]
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
          activeLanguages: [{
            $match: {
              Status: type
            }
          }, {
            $project: {
              _id: 1,
              Status: 1,
              adminName: 1,
              Name: 1,
              Icon: 1,
              Date: {
                $ifNull: ["$Date", "$createdAt"]
              }
            }
          }]
        }
      }]);
      res.json({
        totals: result[0].totals[0] || {
          totalActive: 0,
          totalDraft: 0
        },
        activeLanguages: result[0].activeLanguages
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
// Create a new language
exports.createLanguage = asyncHandler(async (req, res) => {
  const language = new Language(req.body);
  try {
    const newLanguage = await language.save();
    res.status(201).json(newLanguage);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

// Update language by ID
exports.updateLanguage = asyncHandler(async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return res.status(404).json({
        message: "Language not found"
      });
    }
    language.set(req.body);
    const updatedLanguage = await language.save();
    res.json(updatedLanguage);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

// Delete language by ID
exports.deleteLanguage = asyncHandler(async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return res.status(404).json({
        message: "Language not found"
      });
    }
    await Language.findByIdAndDelete(req.params.id);
    res.json({
      message: "Language deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Delete Multiple languages by ID
exports.deleteLanguages = asyncHandler(async (req, res) => {
  try {
    var ids = req.body;
    await Language.deleteMany({
      _id: {
        $in: ids
      }
    });
    res.json({
      message: "Languages deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
//# sourceMappingURL=languages.controller.js.map