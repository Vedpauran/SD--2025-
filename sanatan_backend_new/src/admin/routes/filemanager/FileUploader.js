const express = require("express");
const multer = require("multer");
const router = express.Router();
const File = require("./Files.model");
const fs = require("fs");
const asyncHandler = require("../../utils/asyncHandler");

// Set up multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });

// Route to get all files with optional query and pagination
router.get("/", async (req, res) => {
	const query = req.query.q || "";
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const type = req.query.type || "";

	try {
		const filesCount = await File.countDocuments();
		const files = await File.find({
			name: { $regex: query, $options: "i" },
			type: { $regex: type, $options: "i" },
		})
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);
		res.json({ files, filesCount });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Route to get files filtered by type
router.get("/filter/:type", async (req, res) => {
	try {
		const files = await File.find({ type: req.params.type });
		res.json(files);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Route to upload a new file
router.post(
	"/upload",
	upload.single("file"),
	asyncHandler(async (req, res) => {
		const { originalname, path, filename, size } = req.file;
		const file = new File({
			name: filename,
			path: path,
			type: req.file.mimetype.split("/")[0],
			size: size,
		});

		try {
			const newFile = await file.save();
			res.status(201).json(newFile);
		} catch (err) {
			res.status(400).json({ message: err.message });
		}
	})
);

// Route to delete a file
router.delete("/:id", async (req, res) => {
	try {
		const file = await File.findById(req.params.id);
		if (!file)
			return res.status(404).json({ message: "File not found" });

		fs.unlinkSync(file.path); // Delete file from filesystem

		await File.findByIdAndDelete(req.params.id);
		res.json({ message: "File deleted" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Route to rename a file
router.put("/rename/:id", async (req, res) => {
	try {
		const file = await File.findById(req.params.id);
		if (!file)
			return res.status(404).json({ message: "File not found" });

		const newPath = "uploads/" + req.body.newName;
		fs.renameSync(file.path, newPath);

		file.name = req.body.newName;
		file.path = newPath;
		await file.save();

		res.json(file);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Route to bulk delete files
router.post("/bulk-delete", async (req, res) => {
	try {
		const { ids } = req.body;
		const files = await File.find({ _id: { $in: ids } });

		files.forEach((file) => {
			fs.unlinkSync(file.path); // Delete file from filesystem
		});

		await File.deleteMany({ _id: { $in: ids } });

		res.json({ message: "Files deleted" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
