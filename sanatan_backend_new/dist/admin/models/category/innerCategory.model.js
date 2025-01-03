const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const InnerCategorySchema = new Schema({
  Parent: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true
  },
  Name: {
    type: String,
    required: true,
    unique: true
  },
  Status: {
    type: String
  },
  Description: {
    type: String
  },
  Icon: {
    type: String
  },
  publish: {
    type: Date
  },
  Bannercolor: {
    type: String
  },
  Headfontcolor: {
    type: String
  },
  Colorleft: {
    type: String
  },
  Colorright: {
    type: String
  },
  Names: {
    type: Array
  },
  Languages: [{
    type: Array
  }]
}, {
  timestamps: true
});
const Innercategory = mongoose.model("InnerCategory", InnerCategorySchema);
module.exports = Innercategory;
//# sourceMappingURL=innerCategory.model.js.map