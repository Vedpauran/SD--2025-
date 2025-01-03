const express = require("express");
const router = express.Router();
const Report = require("../models/users/report");
const asyncHandler = require("../utils/asyncHandler");
const createReport = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    reason,
    file,
    filename,
    message
  } = req.body;
  const AddReport = new Report({
    user: req.user._id,
    fullName: fullName,
    email: email,
    reason: reason,
    file: file,
    message: message,
    filename: filename
  });
  try {
    const newReport = await AddReport.save();
    res.status(200).json(newReport);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});
const getReports = asyncHandler(async (req, res) => {
  try {
    const Reports = await Report.find({
      user: req.user._id
    });
    res.status(200).json(Reports);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});
router.route("/add").post(createReport);
router.route("/").get(getReports);
module.exports = router;
//# sourceMappingURL=reports.routes.js.map