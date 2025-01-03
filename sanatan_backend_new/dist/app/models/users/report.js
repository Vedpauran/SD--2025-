const mongoose = require("mongoose");
const {
  ObjectId
} = require("mongodb");
const {
  Schema
} = mongoose;
const reportSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  file: {
    type: String
  }
}, {
  timestamps: true
});
const report = mongoose.model("report", reportSchema);
module.exports = report;
//# sourceMappingURL=report.js.map