const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const ExtrapgSchema = new Schema({
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
  middleinfo: {
    type: String
  },
  documents: {
    type: Array
  },
  video: {
    type: Array
  },
  audio: {
    type: Array
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
  Media: {
    type: Array
  },
  Availablity: {
    type: Object
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
const Extrapg = mongoose.model("Extrapg", ExtrapgSchema);
module.exports = Extrapg;
//# sourceMappingURL=extra.js.map