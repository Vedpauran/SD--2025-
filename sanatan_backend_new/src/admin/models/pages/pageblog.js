const mongoose = require("mongoose");
const { Schema } = mongoose;

const PageBlogSchema = new Schema(
	{
		Availability: {
			type: Object,
		}, // Array of strings for availability
		Media: {
			type: Array,
		}, // Array of strings for media
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		innertitle: {
			type: String,
		},
		innerdescription: {
			type: String,
		},
		middletitle: {
			type: String,
		},
		middledescription: {
			type: String,
		},
		Gallery: {
			type: Array,
		}, // Array of strings for audio files
		// Array of strings for document files
		Language: {
			type: String,
			required: true,
		},
		Page: {
			type: Schema.Types.ObjectId,
			ref: "Page",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const PageBlog = mongoose.model("PageBlog", PageBlogSchema);
module.exports = PageBlog;
