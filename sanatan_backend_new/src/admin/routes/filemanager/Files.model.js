const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		path: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
		},
		dateModified: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

const File = mongoose.model("File", FileSchema);
module.exports = File;
