const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Pages Schema
const PagesSchema = new Schema(
  {
    category: { type: String, required: true },
    subcategory: { type: String },
    pagestyle: { type: String },
    cardstyle: { type: String },
    status: { type: String },
    publish: { type: Date },
    cardcolor: { type: String },
    cardShadow: { type: String },
    shadowx: { type: String },
    shadowy: { type: String },
    shadowx1: { type: String },
    shadowy1: { type: String },
    shadowColor: { type: String },
    blur: { type: String },
    spread: { type: String },
    title: { type: String },
    image: { type: String },
    defaultLanguage: { type: String },
    innerimage: { type: Array },
    Availability: { type: Object },
  },
  { timestamps: true }
);

// Create a static model for 'pages' collection
const Page = mongoose.model("pages", PagesSchema);

// Function to get a dynamic model based on category
const getDynamicPageModel = (categoryName) => {
  if (!categoryName) {
    throw new Error("Category name is required to create a dynamic model.");
  }
  if (mongoose.models[categoryName]) {
    return mongoose.models[categoryName];
  }
  return mongoose.model(categoryName, PagesSchema, categoryName);
};

module.exports = { Page, getDynamicPageModel };
