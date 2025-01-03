const express = require("express");
const router = express.Router();
const Language = require("../../admin/models/applanguage");
const asyncHandler = require("../utils/asyncHandler");
const { ObjectId } = require("mongodb");

router.get(
	"/",
	asyncHandler(async (req, res) => {
		try {
			const languages = await Language.find({
				Status: "STATUS_ACTIVE",
			});
			res.status(200).json(languages);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	})
);

module.exports = router;
