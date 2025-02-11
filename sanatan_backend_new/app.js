const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./.env" });
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/uploads", express.static("uploads"));
app.use("/api/files", express.static("files"));
const corsOptions = {
	origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_LOCAL], // specify the client URL
	credentials: true, // allow credentials (cookies, authentication)
};

app.use(cors(corsOptions));
//Updated Routes

app.use("/api", require("./src/admin/routes/admin.routes")); // For Admin panel Api Routing
app.use("/app/api", require("./src/app/routes/app.routes")); // For App Api Routing

module.exports = app;
