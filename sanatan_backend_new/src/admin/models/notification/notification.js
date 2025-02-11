const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema({
	Title: {
		type: String,
	},
	Languages: {
		type: Array,
	},
});

const Notification = mongoose.model(
	"Notification",
	NotificationSchema
);
module.exports = Notification;
