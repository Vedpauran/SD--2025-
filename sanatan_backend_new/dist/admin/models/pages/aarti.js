const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const AartiSchema = new Schema({
  Availability: {
    type: Object
  },
  // Array of strings for availability
  Media: [{
    type: String
  }],
  // Array of strings for media
  title: {
    type: String,
    required: true
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
  middleinfo: {
    type: String
  },
  audiodescription: {
    type: String
  },
  videodescription: {
    type: String
  },
  documentsdescription: {
    type: String
  },
  audio: [{
    type: String
  }],
  // Array of strings for audio files
  video: [{
    type: String
  }],
  // Array of strings for video files
  documents: [{
    type: String
  }],
  // Array of strings for document files
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
const Aarti = mongoose.model("Aarti", AartiSchema);
module.exports = Aarti;
//# sourceMappingURL=aarti.js.map