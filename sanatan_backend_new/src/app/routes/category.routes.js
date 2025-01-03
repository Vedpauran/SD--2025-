const express = require("express");
const router = express.Router();
const Category = require("../../admin/models/category/mainCategory.model");
const asyncHandler = require("../utils/asyncHandler");
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");



const getActiveCategories = asyncHandler(async (req, res) => {
	const { langid } = req.params;

	try {
		// First, just find active categories and ensure that the basic query works
		const activeCategories = await Category.aggregate([
			{
				$match: {
					Status: "STATUS_ACTIVE",
					CategoryIn: "Pages",
				},
			},
			{
				$match: {
					[`Languages.${langid}.checked`]: true, // Ensure language is correctly referenced
				},
			},

			{
				$project: {
					Name: 1,
					Status: 1,
					CategoryIn: 1,
					Icon: 1,
					Bannercolor: 1,
					Headfontcolor: 1,
					Colorleft: 1,
					Colorright: 1,
					Names: 1,
					categoryName: `$Languages.${langid}.value`, // Project the language-specific name
				},
			},
		]);

		if (activeCategories.length === 0) {
			return res.status(404).json({ message: "No active categories found" });
		}

		res.status(200).json(activeCategories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ message: error.message });
	}
});






// const getActiveCategories = asyncHandler(async (req, res) => {
// 	try {
// 		// Fetch categories that are active and belong to "Pages"
// 		const activeCategories = await Category.find(
// 			{
// 				Status: "STATUS_ACTIVE", // Filter by active categories
// 				CategoryIn: "Pages",    // Belonging to "Pages"
// 			},
// 			{
// 				Name: 1,              // Return specific fields only
// 				Status: 1,
// 				CategoryIn: 1,
// 				Icon: 1,
// 				Bannercolor: 1,
// 				Headfontcolor: 1,
// 				Colorleft: 1,
// 				Colorright: 1,
// 				Names: 1,
// 				Languages: 1,
// 			}
// 		);

// 		// Handle case where no categories are found
// 		if (!activeCategories.length) {
// 			return res.status(404).json({ message: "No active categories found" });
// 		}

// 		// Respond with active categories
// 		res.status(200).json({
// 			success: true,
// 			data: activeCategories,
// 		});
// 	} catch (error) {
// 		// Log and handle errors
// 		console.error("Error fetching categories:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "An error occurred while fetching categories.",
// 		});
// 	}
// });


router.route("/main/:langid").get(getActiveCategories);
// router.route("/main").get(getActiveCategories);


module.exports = router;
