const express = require("express");
const router = express.Router();
const Collection = require("../models/users/collections");
const asyncHandler = require("../utils/asyncHandler");

const toggleCollection = asyncHandler(async (req, res) => {
	try {
		// Check if the collection item already exists
		const collectionitem = await Collection.findOne({
			user: req.user._id,
			item: req.body.item,
		});

		if (collectionitem) {
			// If the collection item exists, remove it
			const removecollection = await Collection.deleteMany({
				user: req.user._id,
				item: req.body.item,
			});
			if (removecollection) {
				return res.status(200).json({
					success: true,
					message: "Item removed from collection",
				});
			}
		} else {
			// If the collection item does not exist, create a new one
			const collection = new Collection({
				user: req.user._id,
				item: req.body.item,
				type: req.body.type,
			});
			const newCollection = await collection.save();
			return res.status(200).json(newCollection);
		}
	} catch (err) {
		// Catch any errors
		return res.status(400).json({ message: err.message });
	}
});

const getCollections = asyncHandler(async (req, res) => {
	try {
		const Collections = await Collection.find({
			user: req.user._id,
			type: req.query.type,
		});
		res.status(200).json(Collections);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

router.route("/").post(toggleCollection);
router.route("/").get(getCollections);

module.exports = router;
