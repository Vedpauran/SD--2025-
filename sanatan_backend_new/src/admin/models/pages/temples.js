// const { Double } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const TempleSchema = new Schema(
	{
		Availability: {
			type: Object,
		}, // Array of strings for availability
		Media: {
			type: Array,
		}, // Array of strings for media with specified values
		title: { type: String, required: true },
		description: { type: String },
		innertitle: { type: String },
		innerdescription: { type: String },
		middletitle: { type: String },
		middledescription: { type: String },
		middleinfo: { type: String },
		audiodescription: { type: String },
		videodescription: { type: String },
		documentsdescription: { type: String },
		Road: { type: String },
		Train: { type: String },
		Air: { type: String },
		RoadLabel: { type: String },
		TrainLabel: { type: String },
		AirLabel: { type: String },
		traveldescription: { type: String },
		country: { type: String },
		city: { type: String },
		state: { type: String },
		street: { type: String },
		postcode: { type: String },
		lat: { type: Number },
		long: { type: Number },

		social: {
			type: Array,
		},
		others: {
			type: Array,
		},
		timings: {
			type: Array,
		},
		otherdescription: { type: String },
		timingdescription: { type: String },
		socialdescription: { type: String },
		audio: [{ type: String }], // Array of strings for audio files
		video: [{ type: String }], // Array of strings for video files
		documents: [{ type: String }], // Array of strings for document files
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

const Temple = mongoose.model("Temple", TempleSchema);
module.exports = Temple;
