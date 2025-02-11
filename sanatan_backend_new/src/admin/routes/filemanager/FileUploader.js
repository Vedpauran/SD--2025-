const express = require("express");
const multer = require("multer");
const router = express.Router();
const File = require("./Files.model");
const fs = require("fs");
const asyncHandler = require("../../utils/asyncHandler");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const S3_CONFIG = require("../../config/s3.config");

const s3 = new S3Client({
  region: S3_CONFIG.REGION,
  credentials: {
    accessKeyId: S3_CONFIG.ACCESS_KEY_ID,
    secretAccessKey: S3_CONFIG.SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_CONFIG.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const mimetype = file.mimetype.split("/");
      const ext = `.${mimetype[1]}`;

      const fullPath = `uploads/${uniqueSuffix}${ext}`;
      cb(null, fullPath);
    },
  }),
});

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
    const file = new File({
      name: req.file.originalname,
      path: req.file.location,
      type: req.file.mimetype.split("/")[0],
      size: req.file.size,
    });

    try {
      await file.save();
      res.status(201).json(file);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

// Route to delete a file
router.delete("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

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
    if (!file) return res.status(404).json({ message: "File not found" });

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
