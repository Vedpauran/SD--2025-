const mongoose = require("mongoose");
const { Schema } = mongoose;

const AppLanguageSchema = new Schema(
	{
		Status: {
			type: String,
		},
		Name: {
			type: String,
			required: true,
			unique: true,
		},

		adminName: {
			type: String,
			required: true,
			unique: true,
		},

		textDirection: {
			type: String,
			default: "LTR",
		},
		Code: {
			type: String,
			default: "",
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

const AppLanguage = mongoose.model("AppLanguage", AppLanguageSchema);
module.exports = AppLanguage;
