const express = require("express");
const router = express.Router();
const Notification = require("../../admin/models/notification/notificationContent");
const asyncHandler = require("../utils/asyncHandler");

const getActiveContentsByLangId = asyncHandler(async (req, res) => {
	const { langid } = req.query;
	try {
		const currentDate = new Date(); // Ensure currentDate is defined
		const contents = await Notification.aggregate([
			{
				$match: {
					Language: langid,
					$or: [{ publish: { $lt: currentDate } }, { publish: null }],
				},
			},
			{
				$lookup: {
					from: "notifications",
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
