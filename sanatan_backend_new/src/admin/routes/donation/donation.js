const express = require("express");
const router = express.Router();
const Donation = require("../../models/donation.page");
const DonationContent = require("../../models/donation");
const asyncHandler = require("../../utils/asyncHandler");
const { default: mongoose } = require("mongoose");
//Donation Page Routes

router.get("/", async (req, res) => {
	try {
		const Donations = await Donation.find();
		res.status(201).json(Donations);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
router.get(
	"/find",
	asyncHandler(async (req, res) => {
		const type = req.query.type;

		try {
			if (type === "") {
				const result = await Donation.aggregate([
					{
						$facet: {
							totals: [
								{
									$group: {
										_id: null,
										published: {
											$sum: {
												$cond: [
													{ $eq: ["$status", "STATUS_ACTIVE"] },
													1,
													0,
												],
											},
										},
										draft: {
											$sum: {
												$cond: [
													{ $eq: ["$status", "STATUS_INACTIVE"] },
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
							activeDonations: [
								{
									$project: {
										_id: 1,
										category: 1,
										subcategory: 1,
										pagestyle: 1,
										cardstyle: 1,
										status: 1,
										publish: 1,
										title: 1,
										Languages: 1,
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
					activeDonations: result[0].activeDonations,
				});
			} else {
				const result = await Donation.aggregate([
					{
						$facet: {
							totals: [
								{
									$group: {
										_id: null,
										published: {
											$sum: {
												$cond: [
													{ $eq: ["$status", "STATUS_ACTIVE"] },
													1,
													0,
												],
											},
										},
										draft: {
											$sum: {
												$cond: [
													{ $eq: ["$status", "STATUS_INACTIVE"] },
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
							activeDonations: [
								{
									$match: { status: type },
								},
								{
									$project: {
										_id: 1,
										category: 1,
										subcategory: 1,
										pagestyle: 1,
										cardstyle: 1,
										status: 1,
										publish: 1,
										title: 1,
										Languages: 1,
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
					activeDonations: result[0].activeDonations,
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	})
);
router.get("/:id", async (req, res) => {
	try {
		const Donations = await Donation.aggregate([
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
		if (!Donations) {
			return res.status(404).json({ message: "Donation not found" });
		}
		res.json(Donations[0]);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

router.post("/add", async (req, res) => {
	try {
		const addDonation = await Donation.create(req.body);
		res.status(200).json(addDonation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const DonationUpdate = await Donation.findByIdAndUpdate(
			_id,
			req.body
		);
		res.status(200).json(DonationUpdate);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const Delete = await Donation.deleteOne({ _id });
		res.status(200).json({ msg: "Successfully Deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Donation Content Routes
router.post("/add/content", async (req, res) => {
	try {
		const addDonation = await DonationContent.create(req.body);
		res.status(200).json(addDonation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/content/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const DonationUpdate = await DonationContent.findByIdAndUpdate(
			_id,
			req.body
		);
		res.status(200).json({ msg: "Successfully Updated" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/content/:id/:lang", async (req, res) => {
	try {
		const Donations = await DonationContent.findOne({
			Page: req.params.id,
			Language: req.params.lang,
		});
		if (!Donations) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Donations = Donations;
		res.status(200).json(res.Donations);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});
router.get("/content/:id", async (req, res) => {
	try {
		const Donations = await DonationContent.findById(req.params.id);
		if (!Donations) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Donations = Donations;
		res.status(200).json(res.Donations);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

module.exports = router;
