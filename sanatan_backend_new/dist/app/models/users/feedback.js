const mongoose = require("mongoose");
const {
  ObjectId
} = require("mongodb");
const {
  Schema
} = mongoose;
const feedbackSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  file: {
    type: String
  }
}, {
  timestamps: true
});
const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
//# sourceMappingURL=feedback.js.map