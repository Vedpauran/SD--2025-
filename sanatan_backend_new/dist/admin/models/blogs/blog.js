const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const BlogSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  pagestyle: {
    type: String
  },
  cardstyle: {
    type: String
  },
  status: {
    type: String
  },
  publish: {
    type: Date
  },
  cardcolor: {
    type: String
  },
  cardShadow: {
    type: String
  },
  shadowx: {
    type: String
  },
  shadowy: {
    type: String
  },
  shadowx1: {
    type: String
  },
  shadowy1: {
    type: String
  },
  shadowColor: {
    type: String
  },
  blur: {
    type: String
  },
  spread: {
    type: String
  },
  title: {
    type: String
  },
  image: {
    type: String
  },
  banner: {
    type: String
  },
  defaultLanguage: {
    type: String
  },
  Availability: {
    type: Object
  },
  Language: {
    type: Array
  }
}, {
  timestamps: true
});
const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
//# sourceMappingURL=blog.js.map