const express = require("express");
const router = express.Router();
const Wishlist = require("../models/users/wishlist");
const asyncHandler = require("../utils/asyncHandler");
const Pages = require("../../admin/models/pages/page.modal");
const { default: mongoose } = require("mongoose");
const ApiResponse = require("../utils/apiresponse");
const Blog = require("../../admin/models/blogs/blog");

const createWishlist = asyncHandler(async (req, res) => {
	try {
		// Check if the wishlist item already exists
		const wishlistitem = await Wishlist.findOne({
			user: req.user._id,
			item: req.body.item,
		});

		if (wishlistitem) {
			// If the wishlist item exists, remove it
			const removewishlist = await Wishlist.deleteMany({
				user: req.user._id,
				item: req.body.item,
			});
			if (removewishlist) {
				return res.status(200).json({
					success: true,
					message: "Item removed from wishlist",
				});
			}
		} else {
			// If the wishlist item does not exist, create a new one
			const wishlist = new Wishlist({
				user: req.user._id,
				item: req.body.item,
				type: req.body.type,
			});
			const newWishlist = await wishlist.save();
			return res.status(200).json(newWishlist);
		}
	} catch (err) {
		// Catch any errors
		return res.status(400).json({ message: err.message });
	}
});

const getWishlists = asyncHandler(async (req, res) => {
	try {
		const type = req.query.type;
		if (type === "Page") {
			return getPages(req.user._id, req.query.language, res);
		}
		if (type === "Blog") {
			return getBlogs(req.user._id, req.query.language, res);
		}
		if (type === "Donation") {
			return getDonations(req.user._id, req.query.language, res);
		}
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

async function getPages(userid, langid, res) {
	try {
		const currentDate = new Date(); // Ensure currentDate is defined
		const contents = await Pages.aggregate([
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
									input: { $objectToArray: "$Availability" },
									cond: {
										$and: [
											{ $eq: ["$$this.v.checked", true] },
											{ $eq: ["$$this.v.value", "Available"] },
										],
									},
								},
							},
							as: "lang",
							in: "$$lang.k", // Extract the language key
						},
					},
				},
			},
			{
				$match: {
					$expr: {
						$gt: [
							{
								$size: {
									$ifNull: [
										{
											$cond: {
												if: { $isArray: "$availableLanguages" },
												then: "$availableLanguages",
												else: [],
											},
										},
										[],
									],
								},
							},
							0,
						],
					},
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
					from: "maincategories",
					localField: "category",
					foreignField: "Name",
					as: "category",
				},
			},
			{
				$addFields: {
					category: {
						$first: "$category",
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
									userid ? new mongoose.Types.ObjectId(userid) : null,
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
					from: "aartis",
					localField: "_id",
					foreignField: "Page",
					as: "aarti",
					let: { availableLanguage: "$availableLanguage" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$Language", "$$availableLanguage"] }, // Use the variable in the match condition
							},
						},
						{
							$project: {
								_id: 1,
								title: 1,
								Language: 1,
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: "pageblogs",
					localField: "_id",
					foreignField: "Page",
					as: "blog",
					let: { availableLanguage: "$availableLanguage" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$Language", "$$availableLanguage"] }, // Use the variable in the match condition
							},
						},
						{
							$project: {
								_id: 1,
								title: 1,
								Language: 1,
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: "scriptures",
					localField: "_id",
					foreignField: "Page",
					as: "scripture",
					let: { availableLanguage: "$availableLanguage" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$Language", "$$availableLanguage"] }, // Use the variable in the match condition
							},
						},
						{
							$project: {
								_id: 1,
								title: 1,
								Language: 1,
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: "scriptures2",
					localField: "_id",
					foreignField: "Page",
					as: "scripture2",
					let: { availableLanguage: "$availableLanguage" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$Language", "$$availableLanguage"] }, // Use the variable in the match condition
							},
						},
						{
							$project: {
								_id: 1,
								title: 1,
								Language: 1,
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: "extrapgs",
					localField: "_id",
					foreignField: "Page",
					as: "extra",
					let: { availableLanguage: "$availableLanguage" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$Language", "$$availableLanguage"] }, // Use the variable in the match condition
							},
						},
						{
							$project: {
								_id: 1,
								title: 1,
								Language: 1,
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: "temples",
					localField: "_id",
					foreignField: "Page",
					as: "temple",
					let: { availableLanguage: "$availableLanguage" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$Language", "$$availableLanguage"] }, // Use the variable in the match condition
							},
						},
						{
							$project: {
								_id: 1,
								title: 1,
								Language: 1,
							},
						},
					],
				},
			},
			{
				$match: {
					favr: true,
				},
			},
		]);

		return res.status(200).json(
			new ApiResponse(
				200,
				{
					contents,
				},
				"Pages fetched Successfully"
			)
		);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function getDonations(userid, langid, res) {
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
									input: { $objectToArray: "$Availability" },
									cond: {
										$and: [
											{ $eq: ["$$this.v.checked", true] },
											{ $eq: ["$$this.v.value", "Available"] },
										],
									},
								},
							},
							as: "lang",
							in: "$$lang.k", // Extract the language key
						},
					},
				},
			},
			{
				$match: {
					$expr: { $gt: [{ $size: "$availableLanguages" }, 0] },
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
								$in: [userid, "$favr.user"],
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
					localField: "_id",
					foreignField: "Page",
					as: "content",
					let: { availableLanguage: "$availableLanguage" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$Language", "$$availableLanguage"] }, // Use the variable in the match condition
							},
						},
					],
				},
			},
		]);

		res.status(200).json(
			new ApiResponse(
				200,
				{
					contents,
				},
				"Pages fetched Successfully"
			)
		);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
async function getBlogs(userid, langid, res) {
	try {
		const contents = await Blog.aggregate([
			{
				$match: {
					status: "STATUS_ACTIVE",
				},
			},
			{
				$match: {
					$or: [{ publish: { $lt: currentDate } }, { publish: null }],
				},
			},
			{
				$addFields: {
					availableLanguages: {
						$map: {
							input: {
								$filter: {
									input: { $objectToArray: "$Availability" },
									cond: {
										$and: [
											{ $eq: ["$$this.v.checked", true] },
											{ $eq: ["$$this.v.value", "Available"] },
										],
									},
								},
							},
							as: "lang",
							in: "$$lang.k", // Extract the language key
						},
					},
				},
			},
			{
				$match: {
					$expr: { $gt: [{ $size: "$availableLanguages" }, 0] },
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
								$in: [userid, "$favr.user"],
							},
							then: true,
							else: false,
						},
					},
				},
			},
			{
				$lookup: {
					from: "blogcontents",
					localField: "_id",
					foreignField: "Page",
					as: "content",
					let: { availableLanguage: "$availableLanguage" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$Language", "$$availableLanguage"] }, // Use the variable in the match condition
							},
						},
						{
							$project: {
								Language: 1,
								_id: 1,
								title: 1,
							},
						},
					],
				},
			},
			{
				$match: {
					favr: true,
				},
			},
		]);

		res.status(200).json(
			new ApiResponse(
				200,
				{
					contents,
				},
				"Pages fetched Successfully"
			)
		);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

router.route("/").post(createWishlist);
router.route("/").get(getWishlists);

module.exports = router;
