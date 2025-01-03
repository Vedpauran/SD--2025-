const mongoose = require("mongoose");
const { Schema } = mongoose;

const PagesSchema = new Schema(
	{
		category: {
			type: String,
			required: true,
		},
		subcategory: {
			type: String,
		},
		pagestyle: {
			type: String,
		},
		cardstyle: {
			type: String,
		},
		status: {
			type: String,
		},
		publish: {
			type: Date,
		},
		cardcolor: {
			type: String,
		},
		cardShadow: {
			type: String,
		},
		shadowx: {
			type: String,
		},
		shadowy: {
			type: String,
		},
		shadowx1: {
			type: String,
		},
		shadowy1: {
			type: String,
		},
		shadowColor: {
			type: String,
		},
		blur: {
			type: String,
		},
		spread: {
			type: String,
		},
		title: {
			type: String,
		},
		image: {
			type: String,
		},
		defaultLanguage: {
			type: String,
		},
		innerimage: {
			type: Array,
		},
		Availability: {
			type: Object,
		},
	},
	{
		timestamps: true,
	}
);

const getDynamicPageModel = (categoryName) => {
	// If the model already exists, use it; otherwise, create a new model
	if (mongoose.models[categoryName]) {
		return mongoose.models[categoryName];
	}
	return mongoose.model(categoryName, PagesSchema, categoryName);
};

module.exports = getDynamicPageModel
