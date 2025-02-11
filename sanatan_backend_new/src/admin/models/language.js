const mongoose = require("mongoose");
const { Schema } = mongoose;

const LanguageSchema = new Schema(
	{
		Status: {
			type: String,
		},
		adminName: {
			type: String,
			required: true,
			unique: true,
		},
		Name: {
			type: String,
			required: true,
			unique: true,
		},
		Icon: {
			type: String,
		},
		Date: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

const Language = mongoose.model("Language", LanguageSchema);
module.exports = Language;
