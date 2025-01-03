const express = require("express");
const router = express.Router();
const Blog = require("../../admin/models/blogs/blog");
const BlogContent = require("../../admin/models/blogs/blogcontent.model");
const asyncHandler = require("../utils/asyncHandler");
const verifyJWT = require("../middleware/verifyjwt");
const { ObjectId } = require("mongodb");
const ApiResponse = require("../utils/apiresponse");
const { default: mongoose } = require("mongoose");
const currentDate = new Date();
const getActiveContentsByLangId = asyncHandler(async (req, res) => {
	const langid = req.params.langid;
	const { page = 1, limit = 10, query } = req.query;

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
								$in: [req.user?._id, "$favr.user"],
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
});
router.route("/contents/:langid").get(getActiveContentsByLangId);

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		try {
			const contents = await BlogContent.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(req.params.id),
					},
				},
				{
					$lookup: {
						from: "blogs",
						localField: "Page",
						foreignField: "_id",
						as: "blog",
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
														? new mongoose.Types.ObjectId(
																req.user._id
														  )
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
									from: "collections",
									localField: "_id",
									foreignField: "item",
									as: "collection",
								},
							},
							{
								$addFields: {
									collection: {
										$cond: {
											if: {
												$in: [
													req.user?._id
														? new mongoose.Types.ObjectId(
																req.user._id
														  )
														: null,
													"$collection.user",
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
						blog: {
							$first: "$blog", // Use $Page to reference the array
						},
					},
				},
			]);
			res.status(200).json(
				new ApiResponse(
					200,

					contents[0],

					"Pages fetched Successfully"
				)
			);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	})
);

module.exports = router;
