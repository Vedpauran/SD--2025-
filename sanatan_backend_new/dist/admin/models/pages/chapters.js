const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const scriptureContent = new Schema({
  languageid: {
    type: String,
    required: true
  },
  parentid: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  content: {
    type: Array
  },
  pdf: {
    type: Array
  },
  video: {
    type: Array
  },
  audio: {
    type: Array
  },
  text: {
    type: Array
  }
}, {
  timestamps: true
});
const Content = mongoose.model("Content", scriptureContent);
module.exports = Content;
//# sourceMappingURL=chapters.js.map