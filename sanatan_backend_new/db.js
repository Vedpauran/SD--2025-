const mongoose = require("mongoose");
async function connectToMongo() {
	try {
		await mongoose.connect(
			`${process.env.MONGODB_URI}/${process.env.DB_NAME}`
		);
		console.log("Connected to db");
	} catch (error) {
		console.log(error);
	}
}

module.exports = connectToMongo;
