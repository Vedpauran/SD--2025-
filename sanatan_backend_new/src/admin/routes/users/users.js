const express = require("express");
const router = express.Router();
const User = require("../../../app/models/users/users");
const Admin = require("../../models/admin");
const Invoice = require("../../../app/models/users/invoice");
const Wishlist = require("../../../app/models/users/wishlist");
const Collection = require("../../../app/models/users/collections");
const asyncHandler = require("../../../app/utils/asyncHandler");
const { default: mongoose } = require("mongoose");

const fetchAdmins = asyncHandler(async (req, res) => {
	try {
		const users = await Admin.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const fetchUsers = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	try {
		const users = await User.aggregate([
			{
				$addFields: {
					created: {
						$ifNull: ["$publish", "$createdAt"],
					},
				},
			},
		]);

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const fetchUser = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const fetchUserDonation = asyncHandler(async (req, res) => {
	try {
		const userInvoices = await Invoice.find({
			user: new mongoose.Types.ObjectId(req.params.id),
		});
		res.status(200).json(userInvoices);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const fetchUserCollections = asyncHandler(async (req, res) => {
	try {
		const userCollection = await Collection.aggregate([
			{
				$match: { user: new mongoose.Types.ObjectId(req.params.id) },
			},
			{
				$lookup: {
					from: "pages",
					localField: "item",
					foreignField: "_id",
					as: "page",
				},
			},
			{
				$addFields: {
					page: { $first: "$page" }, // Get the first matching page
				},
			},
			{
				$addFields: {
					itemName: { $ifNull: ["$page.title", ""] }, // Access page title safely
					category: { $ifNull: ["$page.category", ""] }, // Access page category safely
				},
			},
		]);
		res.status(200).json(userCollection);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const fetchUserWishlist = asyncHandler(async (req, res) => {
	try {
		const userWishlist = await Wishlist.aggregate([
			{
				$match: {
					user: new mongoose.Types.ObjectId(req.params.id),
				},
			},
			{
				$lookup: {
					from: "pages",
					localField: "item",
					foreignField: "_id",
					as: "page",
				},
			},
			{
				$addFields: {
					page: { $first: "$page" }, // Get the first matching page
				},
			},
			{
				$addFields: {
					itemName: { $ifNull: ["$page.title", ""] }, // Access page title safely
					category: { $ifNull: ["$page.category", ""] }, // Access page category safely
				},
			},
		]);
		res.status(200).json(userWishlist);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/find/donations/:id", fetchUserDonation);
router.get("/find/collections/:id", fetchUserCollections);
router.get("/find/wishlist/:id", fetchUserWishlist);
router.get("/admins", fetchAdmins);
router.get("/:id", fetchUser);
router.get("/", fetchUsers);

module.exports = router;
