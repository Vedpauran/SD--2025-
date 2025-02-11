// admin routes.js

const express = require("express");
const app = express.Router();
const verifyJWT = require("../middleware/verifyJwt");

app.use("/uploads/images", verifyJWT, require("./upload/imgs"));
app.use("/uploads/audios", verifyJWT, require("./upload/audios"));
app.use("/uploads/videos", verifyJWT, require("./upload/videos"));
app.use("/uploads/docs", verifyJWT, require("./upload/docs"));
app.use("/socials", verifyJWT, require("./social/social"));
app.use("/feedbacks", verifyJWT, require("./feedback/feedback"));
app.use("/faqs", verifyJWT, require("./faq/faq.page.routes"));
app.use("/faqs/content", verifyJWT, require("./faq/faq.routes"));

app.use(
	"/whatsnew",
	verifyJWT,
	require("./whatsnew/whatsnew.routes")
);
app.use(
	"/whatsnew/content",
	verifyJWT,
	require("./whatsnew/whatsnewContent.routes")
);
app.use(
	"/notification",
	verifyJWT,
	require("./notification/notification.routes")
);
app.use(
	"/notification/content",
	verifyJWT,
	require("./notification/notificationcontent.routes")
);
app.use("/hero", verifyJWT, require("./hero/hero"));

app.use("/invoices", verifyJWT, require("./invoice/invoice"));
app.use("/blogs", verifyJWT, require("./blogs/blogs"));
app.use("/donation", verifyJWT, require("./donation/donation"));

// Handle routes that don't need authentication
app.use("/auth", require("./auth/auth"));
app.use("/registeradmin", require("./auth/auth"));

// Updated Routes
app.use("/dashboard", verifyJWT, require("./dashboard/dashboard"));
app.use(
	"/fileuploader",
	verifyJWT,
	require("./filemanager/FileUploader")
);
app.use("/c", verifyJWT, require("./categories/categories.routes"));
app.use(
	"/languages",
	verifyJWT,
	require("./languages/languages.routes")
);
app.use(
	"/applanguages",
	verifyJWT,
	require("./languages/applanguages.routes")
);
app.use("/pages", verifyJWT, require("./pages/pages.routes"));
app.use(
	"/page/temple",
	verifyJWT,
	require("./pages/temples/temple.routes")
);
app.use(
	"/page/extra",
	verifyJWT,
	require("./pages/extrapages/extrapages.routes")
);
app.use(
	"/page/scripture",
	verifyJWT,
	require("./pages/scriptures/scriptures.routes")
);
app.use(
	"/page/scripture2",
	verifyJWT,
	require("./pages/scriptures/scriptures2.routes")
);
app.use("/page/blog", verifyJWT, require("./pages/blog/blog.routes"));
app.use(
	"/page/aarti",
	verifyJWT,
	require("./pages/aarti/aarti.routes")
);
app.use("/users", verifyJWT, require("./users/users"));
app.use(
	"/menu",
	verifyJWT,
	require("./menu-builder/menu-builder.routes")
);

module.exports = app;
