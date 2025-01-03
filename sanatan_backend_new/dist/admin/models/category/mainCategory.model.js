const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const MaincategorySchema = new Schema({
  CategoryIn: {
    type: String
  },
  Name: {
    type: String,
    required: true,
    unique: true
  },
  Status: {
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
  Languages: {
    type: Object
  }
}, {
  timestamps: true
});
const Maincategory = mongoose.model("Maincategory", MaincategorySchema);
module.exports = Maincategory;
//# sourceMappingURL=mainCategory.model.js.map