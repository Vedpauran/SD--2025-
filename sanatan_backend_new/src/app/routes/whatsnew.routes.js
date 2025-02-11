const express = require("express");
const router = express.Router();
const WhatsNew = require("../../admin/models/whatsnew/whatsnewContent");
const asyncHandler = require("../utils/asyncHandler");

const getActiveContentsByLangId = asyncHandler(async (req, res) => {
	const { langid } = req.query;
	try {
		const contents = await WhatsNew.aggregate([
			{
				$match: {
					Language: langid,
				},
			},
			{
				$lookup: {
					from: "whatsnews",
					localField: "Page",
					foreignField: "_id",
					as: "Page",
					pipeline: [
						{
							$match: {
								Languages: langid,
							},
						},
					],
				},
			},
			{
				$match: {
					Page: {
						$ne: null || [],
					},
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

module.exports = router;
