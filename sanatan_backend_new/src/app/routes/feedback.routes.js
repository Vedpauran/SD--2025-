const express = require("express");
const router = express.Router();
const Feedback = require("../models/users/feedback");
const asyncHandler = require("../utils/asyncHandler");

const createFeedback = asyncHandler(async (req, res) => {
	const { fullName, email, subject, file, feedback } = req.body;
	const AddFeedback = new Feedback({
		user: req.user._id,
		fullName: fullName,
		email: email,
		subject: subject,
		file: file,
		feedback: feedback,
	});
	try {
		const newFeedback = await AddFeedback.save();
		res.status(200).json(newFeedback);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});
const getFeedbacks = asyncHandler(async (req, res) => {
	try {
		const Feedbacks = await Feedback.find({
			user: req.user._id,
		});
		res.status(200).json(Feedbacks);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

router.route("/add").post(createFeedback);
router.route("/").get(getFeedbacks);

module.exports = router;
