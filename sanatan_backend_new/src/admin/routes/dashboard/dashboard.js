const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Category = require("../../models/category/mainCategory.model");
const Subcategory = require("../../models/category/subCategory.model");
const Donation = require("../../models/donation");
const Invoice = require("../../../app/models/users/invoice");
const Language = require("../../models/language");
const Blog = require("../../models/blogs/blog");
const File = require("../filemanager/Files.model");
const User = require("../../../app/models/users/users");
const getDynamicPageModel = require("../../models/pages/page.modal"); // Dynamic model function

router.get("/", async (req, res) => {
    try {
        // Get counts of main entities
        const Categories = await Category.countDocuments();
        const Users = await User.countDocuments();
        const Subcategories = await Subcategory.countDocuments();
        const Donations = await Donation.countDocuments();
        const Invoices = await Invoice.countDocuments();
        const Languages = await Language.countDocuments();
        const Blogs = await Blog.countDocuments();
        const Files = await File.countDocuments();
        const Videos = await File.countDocuments({ type: "video" });
        const Audios = await File.countDocuments({ type: "audio" });
        const Pdfs = await File.countDocuments({ type: "application/pdf" });
        const Images = await File.countDocuments({ type: "image" });
        const Documents = await File.countDocuments({ type: "document" });

        // Dynamic page collection aggregation
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Filter for collections that match dynamic pages structure
        const pageCollections = [];
        for (const collection of collections) {
            const collectionName = collection.name;
            const sampleDoc = await mongoose.connection.db.collection(collectionName).findOne();
            if (sampleDoc && sampleDoc.category && sampleDoc.status) {
                pageCollections.push(collectionName);
            }
        }

        let totalDynamicPages = 0;
        for (const collectionName of pageCollections) {
            const PageModel = getDynamicPageModel(collectionName);

            const count = await PageModel.countDocuments(); // Get total count directly
            totalDynamicPages += count;
        }

        // Compile the response data
        const data = [
            {
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
                pages: totalDynamicPages, // Only the total dynamic pages
            },
        ];

        // Send response
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
