const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const customersupportSchema = new mongoose.Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		file: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const customersupport = mongoose.model(
	"customersupport",
	customersupportSchema
);
module.exports = customersupport;
