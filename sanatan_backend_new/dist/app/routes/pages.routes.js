const express = require("express");
const router = express.Router();
const Page = require("../../admin/models/pages/page.modal");
const Temple = require("../../admin/models/pages/temples");
const Scripture = require("../../admin/models/pages/scriptures");
const Scripture2 = require("../../admin/models/pages/sricptures2");
const Aarti = require("../../admin/models/pages/aarti");
const Blog = require("../../admin/models/pages/pageblog");
const Extra = require("../../admin/models/pages/extra");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const ApiResponse = require("../utils/apiresponse");
const currentDate = new Date();
const getActiveContentsByLangId = asyncHandler(async (req, res) => {
  const catid = req.params.catid;
  const langid = req.params.langid;
  const {
    page = 1,
    limit = 10
  } = req.query;
  try {
    const currentDate = new Date(); // Ensure currentDate is defined

    const contents = await Page.aggregate([{
      $match: {
        status: "STATUS_ACTIVE",
        category: catid,
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
            $size: {
              $ifNull: [{
                $cond: {
                  if: {
                    $isArray: "$availableLanguages"
                  },
                  then: "$availableLanguages",
                  else: []
                }
              }, []]
            }
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
        from: "aartis",
        localField: "_id",
        foreignField: "Page",
        as: "aarti",
        let: {
          availableLanguage: "$availableLanguage"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$Language", "$$availableLanguage"]
            } // Use the variable in the match condition
          }
        }, {
          $project: {
            _id: 1,
            title: 1,
            Language: 1
          }
        }]
      }
    }, {
      $lookup: {
        from: "pageblogs",
        localField: "_id",
        foreignField: "Page",
        as: "blog",
        let: {
          availableLanguage: "$availableLanguage"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$Language", "$$availableLanguage"]
            } // Use the variable in the match condition
          }
        }, {
          $project: {
            _id: 1,
            title: 1,
            Language: 1
          }
        }]
      }
    }, {
      $lookup: {
        from: "scriptures",
        localField: "_id",
        foreignField: "Page",
        as: "scripture",
        let: {
          availableLanguage: "$availableLanguage"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$Language", "$$availableLanguage"]
            } // Use the variable in the match condition
          }
        }, {
          $project: {
            _id: 1,
            title: 1,
            Language: 1
          }
        }]
      }
    }, {
      $lookup: {
        from: "scriptures2",
        localField: "_id",
        foreignField: "Page",
        as: "scripture2",
        let: {
          availableLanguage: "$availableLanguage"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$Language", "$$availableLanguage"]
            } // Use the variable in the match condition
          }
        }, {
          $project: {
            _id: 1,
            title: 1,
            Language: 1
          }
        }]
      }
    }, {
      $lookup: {
        from: "extrapgs",
        localField: "_id",
        foreignField: "Page",
        as: "extra",
        let: {
          availableLanguage: "$availableLanguage"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$Language", "$$availableLanguage"]
            } // Use the variable in the match condition
          }
        }, {
          $project: {
            _id: 1,
            title: 1,
            Language: 1
          }
        }]
      }
    }, {
      $lookup: {
        from: "temples",
        localField: "_id",
        foreignField: "Page",
        as: "temple",
        let: {
          availableLanguage: "$availableLanguage"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$Language", "$$availableLanguage"]
            } // Use the variable in the match condition
          }
        }, {
          $project: {
            _id: 1,
            title: 1,
            Language: 1
          }
        }]
      }
    }, {
      $match: {
        $or: [{
          temple: {
            $nin: [null, []]
          }
        }, {
          scripture: {
            $nin: [null, []]
          }
        }, {
          scripture2: {
            $nin: [null, []]
          }
        }, {
          blog: {
            $nin: [null, []]
          }
        }, {
          aarti: {
            $nin: [null, []]
          }
        }, {
          extra: {
            $nin: [null, []]
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
const getAartiById = asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const content = await Aarti.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $lookup: {
        from: "pages",
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
        }, {
          $lookup: {
            from: "collections",
            localField: "_id",
            foreignField: "item",
            as: "collection"
          }
        }, {
          $addFields: {
            collection: {
              $cond: {
                if: {
                  $in: [req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null, "$collection.user"]
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
    res.status(200).json(new ApiResponse(200, content[0], "Page fetched Successfully"));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
const getTempleById = asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const content = await Temple.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $lookup: {
        from: "pages",
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
        }, {
          $lookup: {
            from: "collections",
            localField: "_id",
            foreignField: "item",
            as: "collection"
          }
        }, {
          $addFields: {
            collection: {
              $cond: {
                if: {
                  $in: [req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null, "$collection.user"]
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
    res.status(200).json(new ApiResponse(200, content[0], "Page fetched Successfully"));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
const getScriptureById = asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const content = await Scripture.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $lookup: {
        from: "pages",
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
        }, {
          $lookup: {
            from: "collections",
            localField: "_id",
            foreignField: "item",
            as: "collection"
          }
        }, {
          $addFields: {
            collection: {
              $cond: {
                if: {
                  $in: [req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null, "$collection.user"]
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
    res.status(200).json(new ApiResponse(200, content[0], "Page fetched Successfully"));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
const getScripture2ById = asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const content = await Scripture2.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $lookup: {
        from: "pages",
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
        }, {
          $lookup: {
            from: "collections",
            localField: "_id",
            foreignField: "item",
            as: "collection"
          }
        }, {
          $addFields: {
            collection: {
              $cond: {
                if: {
                  $in: [req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null, "$collection.user"]
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
    res.status(200).json(new ApiResponse(200, content[0], "Page fetched Successfully"));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
const getBlogById = asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const content = await Blog.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $lookup: {
        from: "pages",
        localField: "Page",
        foreignField: "_id",
        as: "Page"
      }
    }, {
      $addFields: {
        Page: {
          $first: "$Page" // Use $Page to reference the array
        }
      }
    }]);
    res.status(200).json(new ApiResponse(200, content[0], "Page fetched Successfully"));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
const getExtraById = asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const content = await Extra.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      $lookup: {
        from: "pages",
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
        }, {
          $lookup: {
            from: "collections",
            localField: "_id",
            foreignField: "item",
            as: "collection"
          }
        }, {
          $addFields: {
            collection: {
              $cond: {
                if: {
                  $in: [req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null, "$collection.user"]
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
    res.status(200).json(new ApiResponse(200, content[0], "Page fetched Successfully"));
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.route("/contents/:catid/:langid").get(getActiveContentsByLangId);
///:category/:language
router.route("/content/temple/:id").get(getTempleById);
router.route("/content/aarti/:id").get(getAartiById);
router.route("/content/blog/:id").get(getBlogById);
router.route("/content/extra/:id").get(getExtraById);
router.route("/content/scripture/:id").get(getScriptureById);
router.route("/content/scripture2/:id").get(getScripture2ById);
module.exports = router;
//# sourceMappingURL=pages.routes.js.map