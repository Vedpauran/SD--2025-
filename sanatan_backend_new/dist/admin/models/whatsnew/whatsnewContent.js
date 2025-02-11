const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const WhatsnewContentSchema = new Schema({
  Title: {
    type: String
  },
  Publish: {
    type: Date
  },
  Links: {
    type: String
  },
  Tags: {
    type: String
  },
  Language: {
    type: String,
    required: true
  },
  Page: {
    type: Schema.Types.ObjectId,
    ref: "Whatsnew",
    required: true
  }
});
const WhatsnewContent = mongoose.model("WhatsnewContent", WhatsnewContentSchema);
module.exports = WhatsnewContent;
//# sourceMappingURL=whatsnewContent.js.map