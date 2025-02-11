const express = require("express");
const router = express.Router();
const innerCategory = require("../../models/category/innerCategory.model");

router.get("/", async (req, res) => {
	try {
		const subcategory = await innerCategory.find();
		res.status(201).json(subcategory);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/add", async (req, res) => {
	try {
		const cat = await innerCategory.create(req.body);
		res.status(200).json(cat);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/:id", getcat, (req, res) => {
	res.json(res.subcategory);
});
async function getcat(req, res, next) {
	try {
		const subcategory = await innerCategory.findById(req.params.id);
		if (!subcategory) {
			return res.status(404).json({ message: "Not Found" });
		}
		res.subcategory = subcategory;
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

module.exports = router;
