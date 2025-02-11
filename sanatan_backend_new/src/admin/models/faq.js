const mongoose = require("mongoose");
const { Schema } = mongoose;

const FaqsSchema = new Schema(
	{
		title: {
			type: String,
		},
		Status: {
			type: String,
		},
		Languages: {
			type: Array,
		},
	},
	{ timestamps: true }
);

const Faqs = mongoose.model("Faqs", FaqsSchema);
module.exports = Faqs;
