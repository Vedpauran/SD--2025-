const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchema = new Schema(
	{
		Parent: {
			type: Schema.Types.ObjectId,
			ref: "Maincategory",
			required: true,
		},
		Name: {
			type: String,
			required: true,
			unique: true,
		},
		Status: {
			type: String,
		},
		Description: {
			type: String,
		},
		Icon: {
			type: String,
		},
		publish: {
			type: Date,
		},
		Bannercolor: {
			type: String,
		},
		Headfontcolor: {
			type: String,
		},
		Colorleft: {
			type: String,
		},
		Colorright: {
			type: String,
		},
		Names: {
			type: Array,
		},
		Languages: {
			type: Object,
		},
	},
	{
		timestamps: true,
	}
);

const Subcategory = mongoose.model("Subcategory", subCategorySchema);
module.exports = Subcategory;
