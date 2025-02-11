const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationContentSchema = new Schema({
	Name: {
		type: String,
	},
	Link: {
		type: String,
	},
	Description: {
		type: String,
	},
	Publish: {
		type: Date,
	},
	Language: {
		type: String,
		required: true,
	},
	Page: {
		type: Schema.Types.ObjectId,
		ref: "Notification",
		required: true,
	},
});

const NotificationContent = mongoose.model(
	"NotificationContent",
	NotificationContentSchema
);
module.exports = NotificationContent;
