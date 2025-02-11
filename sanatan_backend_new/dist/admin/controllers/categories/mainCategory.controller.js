// categoryController.js

const {
  default: mongoose
} = require("mongoose");
const Category = require("../../models/category/mainCategory.model");
const asyncHandler = require("../../utils/asyncHandler");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([{
      $addFields: {
        date: {
          $ifNull: ["$date", "$createdAt"]
        },
        linercolor: ["$Colorleft", "$Colorright"]
      }
    }]);
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Get categories by page
exports.getCategoriesByPage = async (req, res) => {
  try {
    const categories = await Category.aggregate([{
      $match: {
        CategoryIn: req.params.categoryin
      }
    }, {
      $addFields: {
        date: {
          $ifNull: ["$date", "$createdAt"]
        }
      }
    }]);
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories by page:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Find categories by type or get all categories
exports.FindCategory = asyncHandler(async (req, res) => {
  const type = req.query.type || "";
  try {
    const aggregationPipeline = [{
      $addFields: {
        linearcolor: ["$Colorleft", "$Colorright"]
      }
    }, {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "Parent",
        as: "subcategories",
        pipeline: [{
          $lookup: {
            from: "innercategories",
            localField: "_id",
            foreignField: "Parent",
            as: "innercategories"
          }
        }, {
          $addFields: {
            innercategoriesCount: {
              $size: "$innercategories"
            }
          }
        }]
      }
    }, {
      $addFields: {
        subcategoriesCount: {
          $size: "$subcategories"
        },
        innercategoriesCount: {
          $sum: "$subcategories.innercategories"
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
        activeCategory: [{
          $project: {
            _id: 1,
            Status: 1,
            Name: 1,
            Icon: 1,
            publish: {
              $ifNull: ["$publish", "$createdAt"]
            },
            Colorleft: 1,
            Colorright: 1,
            CategoryIn: 1,
            linearcolor: 1,
            subcategoriesCount: 1,
            innercategoriesCount: 1
          }
        }]
      }
    }];
    if (type !== "") {
      aggregationPipeline.splice(0, 0, {
        $match: {
          Status: type
        }
      });
    }
    const result = await Category.aggregate(aggregationPipeline);
    res.json({
      totals: result[0].totals[0] || {
        totalActive: 0,
        totalDraft: 0
      },
      activeCategory: result[0].activeCategory
    });
  } catch (err) {
    console.error("Error finding categories:", err);
    res.status(500).json({
      message: err.message
    });
  }
});

// Get category by ID
exports.getCategoryById = async (req, res) => {
  const {
    id
  } = req.params;

  // Validate if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid category ID"
    });
  }
  try {
    const category = await Category.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(id)
      }
    }, {
      $addFields: {
        publish: {
          $ifNull: ["$publish", "$createdAt"]
        }
      }
    }]);
    if (!category || category.length === 0) {
      return res.status(404).json({
        message: "Category not found"
      });
    }
    res.json(category[0]);
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Get category by Type
exports.getCategoryByType = async (req, res) => {
  try {
    const category = await Category.find({
      type: req.params.type
    });
    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }
    res.json(category);
  } catch (err) {
    console.error("Error fetching category by type:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const {
    Name
  } = req.body;
  try {
    const existingCategory = await Category.findOne({
      Name
    });
    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.status(200).json(newCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
  const {
    id
  } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid category ID"
    });
  }
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }
    category.set(req.body);
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
  const {
    id
  } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid category ID"
    });
  }
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }
    res.json({
      message: "Category deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Get active categories
exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([{
      $match: {
        Status: "STATUS_ACTIVE"
      }
    }, {
      $addFields: {
        date: {
          $ifNull: ["$date", "$createdAt"]
        }
      }
    }]);
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        message: "No active categories found"
      });
    }
    res.json(categories);
  } catch (err) {
    console.error("Error fetching active categories:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Get draft categories
exports.getDraftCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      Status: "STATUS_INACTIVE"
    });
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        message: "No draft categories found"
      });
    }
    res.json(categories);
  } catch (err) {
    console.error("Error fetching draft categories:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// Get trash categories
exports.getTrashCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isTrash: true
    });
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        message: "No trashed categories found"
      });
    }
    res.json(categories);
  } catch (err) {
    console;
    res.status(500).json({
      message: err.message
    });
  }
};
//# sourceMappingURL=mainCategory.controller.js.map