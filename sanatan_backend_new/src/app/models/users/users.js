const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		fullName: {
			type: String,
		},
		userId: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		userPic: {
			type: String,
		},
		gender: {
			type: String,
			default: "",
		},
		otp: { type: String },
		otpExpires: { type: Date },
		phone: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		address: {
			type: String,
		},
		city: {
			type: String,
		},
		state: {
			type: String,
		},
		country: {
			type: String,
		},
		pin: {
			type: String,
		},
		donationHistory: {
			type: Array,
		},
		history: {
			type: Array,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullName: this.fullName,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.APP_ACCESS_TOKEN_EXPIRY,
		}
	);
};
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.APP_REFRESH_TOKEN_EXPIRY,
		}
	);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
