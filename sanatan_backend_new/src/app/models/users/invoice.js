const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const InvoiceSchema = new mongoose.Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		donationId: {
			type: Schema.Types.ObjectId,
			ref: "Donation",
			required: true,
		},
		paymentId: {
			type: String,
		},
		paymentType: {
			type: String,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;
