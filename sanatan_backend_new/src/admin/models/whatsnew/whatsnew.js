const mongoose = require("mongoose");
const { Schema } = mongoose;

const WhatsnewSchema = new Schema({
	Title: {
		type: String,
	},
	Languages: {
		type: Array,
	},
});

const Whatsnew = mongoose.model("Whatsnew", WhatsnewSchema);
module.exports = Whatsnew;
