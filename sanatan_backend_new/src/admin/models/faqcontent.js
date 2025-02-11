const mongoose = require("mongoose");
const { Schema } = mongoose;

const FaqContentSchema = new Schema(
	{
		title: {
			type: String,
		},
		description: {
			type: String,
		},
		Language: {
			type: String,
			required: true,
		},
		Page: {
			type: Schema.Types.ObjectId,
			ref: "Faq",
			required: true,
		},
	},
	{ timestamps: true }
);

const FaqContent = mongoose.model("FaqContent", FaqContentSchema);
module.exports = FaqContent;
