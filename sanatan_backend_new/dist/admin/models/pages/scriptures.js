const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const ScripturesSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  innertitle: {
    type: String
  },
  innerdescription: {
    type: String
  },
  middletitle: {
    type: String
  },
  middledescription: {
    type: String
  },
  includeDescription: {
    type: String
  },
  include: {
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
  },
  Availability: {
    type: Object
  },
  Media: [{
    type: String
  }],
  // Array of strings for media
  Chapters: {
    type: Array
  },
  Language: {
    type: String,
    required: true
  },
  Page: {
    type: Schema.Types.ObjectId,
    ref: "Page",
    required: true
  }
}, {
  timestamps: true
});
const Scriptures = mongoose.model("Scriptures", ScripturesSchema);
module.exports = Scriptures;
//# sourceMappingURL=scriptures.js.map