const express = require("express");
const router = express.Router();
const customerService = require("../models/users/customerSupport");
const asyncHandler = require("../utils/asyncHandler");

const createcustomerService = asyncHandler(async (req, res) => {
	const { fullName, email, subject, file, message } = req.body;
	const AddcustomerService = new customerService({
		user: req.user._id,
		fullName: fullName,
		email: email,
		subject: subject,
		file: file,
		message: message,
	});
	try {
		const newcustomerService = await AddcustomerService.save();
		res.status(200).json(newcustomerService);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});
const getcustomerServices = asyncHandler(async (req, res) => {
	try {
		const customerServices = await customerService.find({
			user: req.user._id,
		});
		res.status(200).json(customerServices);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

router.route("/add").post(createcustomerService);
router.route("/").get(getcustomerServices);

module.exports = router;
