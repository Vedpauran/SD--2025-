const mongoose = require("mongoose");
const { Schema } = mongoose;

const DonationContentSchema = new Schema({
	Availability: {
		type: Object,
	}, // Array of strings for availability
	Media: {
		type: Array,
	}, // Array of strings for media
	title: { type: String, required: true },
	description: { type: String },
	Gallery: { type: Array }, // Array of strings for gallery images
	goal: { type: String },
	goaldescription: { type: String },
	basic: { type: String },
	basic2: { type: String },
	basic3: { type: String },
	basic4: { type: String },
	basic5: { type: String },
	basic6: { type: String },
	Language: {
		type: String,
		required: true,
	},
	Page: {
		type: Schema.Types.ObjectId,
		ref: "Page",
		required: true,
	},
});

const DonationContent = mongoose.model(
	"DonationContent",
	DonationContentSchema
);
module.exports = DonationContent;
