const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const collectionSchema = new mongoose.Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		item: {
			type: Schema.Types.ObjectId,
			ref: "Item",
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		progress: {
			type: String,
		},
		isComplete: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const Collection = mongoose.model("Collection", collectionSchema);
module.exports = Collection;
