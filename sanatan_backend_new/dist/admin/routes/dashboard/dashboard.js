const express = require("express");
const router = express.Router();
const Category = require("../../models/category/mainCategory.model");
const Subcategory = require("../../models/category/subCategory.model");
const Donation = require("../../models/donation");
const Invoice = require("../../../app/models/users/invoice");
const Language = require("../../models/language");
const Blog = require("../../models/blogs/blog");
const File = require("../filemanager/Files.model");
const User = require("../../../app/models/users/users");
const Pages = require("../../models/pages/page.modal");
router.get("/", async (req, res) => {
  try {
    const Categories = await Category.countDocuments();
    const Users = await User.countDocuments();
    const Subcategories = await Subcategory.countDocuments();
    const Donations = await Donation.countDocuments();
    const Invoices = await Invoice.countDocuments();
    const Languages = await Language.countDocuments();
    const Blogs = await Blog.countDocuments();
    const Page = await Pages.countDocuments();
    const Files = await File.countDocuments();
    const Videos = await File.countDocuments({
      type: "video"
    });
    const Audios = await File.countDocuments({
      type: "audio"
    });
    const Pdfs = await File.countDocuments({
      type: "application/pdf"
    });
    const Images = await File.countDocuments({
      type: "image"
    });
    const Documents = await File.countDocuments({
      type: "document"
    });
    let data = [{
      category: Categories,
      subcategory: Subcategories,
      donation: Donations,
      invoice: Invoices,
      language: Languages,
      blog: Blogs,
      file: Files,
      video: Videos,
      audio: Audios,
      pdfs: Pdfs,
      images: Images,
      users: Users,
      documents: Documents,
      pages: Page
    }];
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;
//# sourceMappingURL=dashboard.js.map