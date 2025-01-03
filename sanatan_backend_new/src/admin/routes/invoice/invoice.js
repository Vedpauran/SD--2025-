const express = require("express");
const router = express.Router();
const Invoice = require("../../../app/models/users/invoice");
const moment = require("moment");

router.get("/", async (req, res) => {
	try {
		const invoices = await Invoice.find();
		res.status(201).json(invoices);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/:id", getInvoice, (req, res) => {
	res.json(res.Invoice);
});
async function getInvoice(req, res, next) {
	try {
		const Invoices = await Invoice.findOne({ email: req.body.email });
		if (Invoices == "") {
			return res.status(404).json({ message: "Not Found" });
		}
		res.Invoice = Invoices;
		res.json(res.Invoice);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

module.exports = router;
