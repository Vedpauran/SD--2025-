// app routes.js

const express = require("express");
const verifyJWT = require("../middleware/verifyjwt");
const app = express.Router();

app.use("/user", require("./user.routes"));
app.use("/pages", verifyJWT, require("./pages.routes"));
app.use("/blogs", verifyJWT, require("./blogs.routes"));
app.use("/donations", verifyJWT, require("./donation.routes"));
app.use("/category", verifyJWT, require("./category.routes"));
app.use("/languages", verifyJWT, require("./languages.routes"));
app.use("/whatsnew", verifyJWT, require("./whatsnew.routes"));
app.use(
	"/notifications",
	verifyJWT,
	require("./notification.routes")
);
app.use("/banner", verifyJWT, require("./banner.routes"));
app.use("/feedback", verifyJWT, require("./feedback.routes"));
app.use("/faqs", verifyJWT, require("./faq.routes"));
app.use("/wishlist", verifyJWT, require("./wishlist.routes"));
app.use("/collection", verifyJWT, require("./collection.routes"));
app.use("/menu", verifyJWT, require("./menubuilder.routes"));
app.use("/socialmedia", verifyJWT, require("./socialmedia.routes"));
app.use(
	"/customer-service",
	verifyJWT,
	require("./customer-service.routes")
);
app.use("/report", verifyJWT, require("./reports.routes"));

module.exports = app;
