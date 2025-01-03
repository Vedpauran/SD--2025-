// categoryController.js

const Category = require("../../models/category/subCategory.model");
const asyncHandler = require("../../utils/asyncHandler");
const mongoose = require("mongoose");
// Get all categories
exports.getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({ Parent: req.params.id }).populate("Maincategory");
		console.log("category", categories);

		res.json(categories);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.FindCategory = asyncHandler(async (req, res) => {
	const type = req.query.type;
	const id = req.params.id;

	try {
		if (type === "") {
			const result = await Category.aggregate([
				{
					$match: {
						Parent: new mongoose.Types.ObjectId(id),
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
											$cond: [
												{ $eq: ["$Status", "STATUS_ACTIVE"] },
												1,
												0,
											],
										},
									},
									draft: {
										$sum: {
											$cond: [
												{ $eq: ["$Status", "STATUS_INACTIVE"] },
												1,
												0,
											],
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
						activeCategory: [
							{
								$project: {
									_id: 1,
									Status: 1,
									Name: 1,
									Icon: 1,
									publish: {
										$ifNull: ["$publish", "$createdAt"],
									},
									Colorleft: 1,
									Colorright: 1,
									Parent: 1,
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
				activeCategory: result[0].activeCategory,
			});
		} else {
			const result = await Category.aggregate([
				{
					$match: {
						Parent: new mongoose.Types.ObjectId(id),
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
											$cond: [
												{ $eq: ["$Status", "STATUS_ACTIVE"] },
												1,
												0,
											],
										},
									},
									draft: {
										$sum: {
											$cond: [
												{ $eq: ["$Status", "STATUS_INACTIVE"] },
												1,
												0,
											],
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
						activeCategory: [
							{
								$match: {
									Status: type,
								},
							},
							{
								$project: {
									_id: 1,
									Status: 1,
									Name: 1,
									Icon: 1,
									publish: {
										$ifNull: ["$publish", "$createdAt"],
									},
									Colorleft: 1,
									Colorright: 1,
									Parent: 1,
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
				activeCategory: result[0].activeCategory,
			});
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});
// Get category by ID
exports.getCategoryById = async (req, res) => {
	try {
		const category = await Category.aggregate([
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
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		res.json(category[0]);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
// Get category by Type
exports.getCategoryByType = async (req, res) => {
	try {
		const category = await Category.find({ type: req.params.type });
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		res.json(category);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
// Create a new category
exports.createCategory = async (req, res) => {
	const existingCategory = await Category.findOne({
		Name: req.body.Name,
	});
	if (existingCategory) {
		return res
			.status(400)
			.json({ message: "Category already exists" });
	}
	const category = new Category(req.body);

	try {
		const newCategory = await category.save();
		res.status(200).json(newCategory);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};

// Update category by ID
exports.updateCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		category.set(req.body);
		const updatedCategory = await category.save();
		res.json(updatedCategory);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id);
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.json({ message: "Category deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get categories
exports.getActiveCategories = async (req, res) => {
	try {
		const category = await Category.find({ status: "STATUS_ACTIVE" });
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		res.json(category);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get categories
exports.getDraftCategories = async (req, res) => {
	try {
		const category = await Category.find({
			status: "STATUS_INACTIVE",
		});
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		res.json(category);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get categories
exports.getTrashCategories = async (req, res) => {
	try {
		const category = await Category.find({ isTrash: true });
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		res.json(category);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
