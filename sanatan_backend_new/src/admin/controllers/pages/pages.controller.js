const getDynamicPageModel = require('../../models/pages/page.modal');
const asyncHandler = require("../../utils/asyncHandler");
const { default: mongoose } = require("mongoose");


exports.getAllPages = async (req, res) => {
    try {
        // Fetch all collections in the database
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Filter out system collections and collections that don't match the PagesSchema
        const collectionNames = collections
            .map((collection) => collection.name)
            .filter((name) => 
                name !== "system.indexes" && 
                name !== "admin" && 
                name !== "local" && 
                typeof name === "string" // Ensuring valid collection names
            );
            
        // Log the collection names for debugging
        console.log("Available collections:", collectionNames);

        // Check if each collection matches the PagesSchema structure
        const pageCollections = [];

        for (const collectionName of collectionNames) {
            // Fetch one document to check if it matches the PagesSchema structure
            const sampleDoc = await mongoose.connection.db.collection(collectionName).findOne();

            if (sampleDoc && sampleDoc.category && sampleDoc.status) {
                // The collection matches the schema structure, add it to the pageCollections list
                pageCollections.push(collectionName);
            }
        }

        if (pageCollections.length === 0) {
            return res.status(404).json({ message: "No valid page collections found" });
        }

        // Fetch documents from the valid page collections
        const allPagesPromises = pageCollections.map(async (collectionName) => {
            const PageModel = getDynamicPageModel(collectionName); // Dynamically get the model
            const pages = await PageModel.find().lean(); // Fetch all documents in the collection
            return pages.map((page) => ({ ...page, category: collectionName })); // Add collection name as category
        });

        const allPagesArray = await Promise.all(allPagesPromises); // Resolve all promises
        const allPages = allPagesArray.flat(); // Flatten the array of arrays into a single array

        res.status(200).json(allPages); // Return all pages
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
};


exports.FindPages = asyncHandler(async (req, res) => {
    const { type, category } = req.query;

    try {
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Filter collections to exclude system collections
        const collectionNames = collections
            .map((collection) => collection.name)
            .filter((name) =>
                name !== "system.indexes" &&
                name !== "admin" &&
                name !== "local" &&
                typeof name === "string"
            );

        // Filter collections matching the PagesSchema
        const pageCollections = [];
        for (const collectionName of collectionNames) {
            const sampleDoc = await mongoose.connection.db.collection(collectionName).findOne();
            if (sampleDoc && sampleDoc.category && sampleDoc.status) {
                pageCollections.push(collectionName);
            }
        }

        if (pageCollections.length === 0) {
            return res.status(404).json({ message: "No valid page collections found" });
        }

        // Aggregate data from all valid collections
        const allPagesPromises = pageCollections.map(async (collectionName) => {
            const PageModel = getDynamicPageModel(collectionName);

            const pipeline = [
                {
                    $addFields: {
                        publish: {
                            $ifNull: ["$publish", "$createdAt"],
                        },
                    },
                },
                {
                    $facet: {
                        totals: [
                            {
                                $group: {
                                    _id: null,
                                    published: {
                                        $sum: {
                                            $cond: [
                                                { $eq: ["$status", "STATUS_ACTIVE"] },
                                                1,
                                                0,
                                            ],
                                        },
                                    },
                                    draft: {
                                        $sum: {
                                            $cond: [
                                                { $eq: ["$status", "STATUS_INACTIVE"] },
                                                1,
                                                0,
                                            ],
                                        },
                                    },
                                    all: { $sum: 1 },
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    published: 1,
                                    draft: 1,
                                    all: 1,
                                },
                            },
                        ],
                        activePages: [
                            {
                                $match: type
                                    ? { status: type }
                                    : {},
                            },
                            {
                                $project: {
                                    _id: 1,
                                    category: 1,
                                    subcategory: 1,
                                    pagestyle: 1,
                                    cardstyle: 1,
                                    status: 1,
                                    publish: 1,
                                    title: 1,
                                    Languages: 1,
                                },
                            },
                        ],
                    },
                },
            ];

            const result = await PageModel.aggregate(pipeline);

            return {
                collection: collectionName,
                totals: result[0].totals[0] || {
                    published: 0,
                    draft: 0,
                    all: 0,
                },
                activePages: result[0].activePages || [],
            };
        });

        const allPagesResults = await Promise.all(allPagesPromises);

        // Combine totals and active pages from all collections
        const combinedTotals = allPagesResults.reduce(
            (acc, curr) => {
                acc.totalActive += curr.totals.published;
                acc.totalDraft += curr.totals.draft;
                acc.all += curr.totals.all;
                return acc;
            },
            { totalActive: 0, totalDraft: 0, all: 0 }
        );

        const combinedActivePages = allPagesResults.flatMap((result) =>
            result.activePages.map((page) => ({
                ...page,
                category: result.collection, // Add collection name as category
            }))
        );

        res.json({
            totals: combinedTotals,
            activePages: combinedActivePages,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Create a new page
exports.createPage = async (req, res) => {
    const { category, ...pageData } = req.body;

    try {
        const PageModel = getDynamicPageModel(category); // Get the dynamic model
        
        // Create and save the new page in the specified category collection
        const newPage = await new PageModel({ category, ...pageData }).save();
        res.status(201).json(newPage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.deletePage = async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Get collection names and exclude system collections
        const collectionNames = collections
            .map((collection) => collection.name)
            .filter(
                (name) =>
                    name !== "system.indexes" &&
                    name !== "admin" &&
                    name !== "local" &&
                    typeof name === "string"
            );

        const { category } = req.query;

        // Validate the category parameter
        if (!category || !collectionNames.includes(category)) {
            return res.status(400).json({ message: "Invalid or missing category" });
        }

        const PageModel = getDynamicPageModel(category);
        const page = await PageModel.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        // Handle related collections if any
        if (page.relatedCollections && Array.isArray(page.relatedCollections)) {
            const relatedDeletionPromises = page.relatedCollections.map(async (relation) => {
                if (!relation.collectionName || !relation.field) {
                    throw new Error("Invalid relation in relatedCollections");
                }
                const RelatedModel = getDynamicPageModel(relation.collectionName);
                return RelatedModel.deleteMany({ [relation.field]: req.params.id });
            });

            await Promise.all(relatedDeletionPromises);
        }

        // Delete the main page
        await PageModel.findByIdAndDelete(req.params.id);

        res.json({ message: "Page and related documents deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Delete multiple pages by IDs
exports.deletePages = async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Filter collections to exclude system collections
        const collectionNames = collections
            .map((collection) => collection.name)
            .filter(
                (name) =>
                    name !== "system.indexes" &&
                    name !== "admin" &&
                    name !== "local" &&
                    typeof name === "string"
            );

        const { category } = req.query;

        if (!category || !collectionNames.includes(category)) {
            return res.status(400).json({ message: "Invalid or missing category" });
        }

        const PageModel = getDynamicPageModel(category);

        if (!req.body || !Array.isArray(req.body)) {
            return res.status(400).json({ message: "Invalid page IDs provided" });
        }

        const deletionPromises = req.body.map(async (pageId) => {
            const page = await PageModel.findById(pageId);

            if (page) {
                if (page.relatedCollections && Array.isArray(page.relatedCollections)) {
                    const relatedDeletionPromises = page.relatedCollections.map(async (relation) => {
                        if (!relation.collectionName || !relation.field) {
                            throw new Error("Invalid relation in relatedCollections");
                        }
                        const RelatedModel = getDynamicPageModel(relation.collectionName);
                        return RelatedModel.deleteMany({ [relation.field]: pageId });
                    });

                    await Promise.all(relatedDeletionPromises);
                }

                await PageModel.findByIdAndDelete(pageId);
            }
        });

        await Promise.all(deletionPromises);


        res.json({ message: "Pages and related documents deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.getPageById = async (req, res) => {
    try {
        // Fetch all collections in the database
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Get collection names and exclude system collections
        const collectionNames = collections
            .map((collection) => collection.name)
            .filter(
                (name) =>
                    name !== "system.indexes" &&
                    name !== "admin" &&
                    name !== "local" &&
                    typeof name === "string"
            );

        // Validate the ObjectId format
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid page ID format" });
        }

        let pageData = null;
        let foundInCollection = null;

        // Iterate over collections to find the document
        for (let collectionName of collectionNames) {
            const Model = getDynamicPageModel(collectionName);
            if (!Model) {
                continue; // Skip if model creation fails
            }

            const result = await Model.findById(id).lean();
            if (result) {
                pageData = result;
                foundInCollection = collectionName;
                break;
            }
        }

        // If no page is found, return a 404
        if (!pageData) {
            return res.status(404).json({ message: "Page not found in any collection" });
        }

        // Return the page data and its collection
        res.status(200).json({
            page: pageData,
            collection: foundInCollection, // Include the collection name for reference
        });
    } catch (err) {
        console.error(`Error in getPageById: ${err.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};  


exports.updatePage = async (req, res) => {
    try {
        const { category } = req.query;
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections
            .map((collection) => collection.name)
            .filter(
                (name) =>
                    name !== "system.indexes" &&
                    name !== "admin" &&
                    name !== "local" &&
                    typeof name === "string"
            );

        if (!category || !collectionNames.includes(category)) {
            return res.status(400).json({ message: "Invalid or missing category" });
        }

        const PageModel = getDynamicPageModel(category);

        // Update page with data from the request body
        const updatedPage = await PageModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Return the updated document
        );

        if (!updatedPage) {
            return res.status(404).json({ message: "Page not found" });
        }

        res.status(200).json({ message: "Page updated successfully", data: updatedPage });
    } catch (err) {
        console.error("Error updating page:", err.message);
        res.status(500).json({ message: err.message });
    }
};


exports.UpdatePageAvailability = async (req, res) => {
    try {
        const { category } = req.query;
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections
            .map((collection) => collection.name)
            .filter(
                (name) =>
                    name !== "system.indexes" &&
                    name !== "admin" &&
                    name !== "local" &&
                    typeof name === "string"
            );

        if (!category || !collectionNames.includes(category)) {
            return res.status(400).json({ message: "Invalid or missing category" });
        }

        const PageModel = getDynamicPageModel(category);

        // Update Availability and defaultLanguage fields
        const updatedPage = await PageModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    Availability: req.body.Availability,
                    defaultLanguage: req.body.defaultLanguage,
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedPage) {
            return res.status(404).json({ message: "Page not found" });
        }

        res.status(200).json({ message: "Page availability updated successfully", data: updatedPage });
    } catch (err) {
        console.error("Error updating page availability:", err.message);
        res.status(500).json({ message: err.message });
    }
};



exports.getPageAvailability = async (req, res) => {
    try {
        const { category } = req.query;
        const { id } = req.params;

        if (!category || typeof category !== "string" || category.trim() === "") {
            return res.status(400).json({ message: "Category is required and must be a valid string" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid page ID" });
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map((c) => c.name);

        if (!collectionNames.includes(category)) {
            return res.status(400).json({
                message: `Invalid or non-existent category. Provided: ${category}. Available: ${collectionNames.join(", ")}.`,
            });
        }

        const PageModel = getDynamicPageModel(category.trim());
        if (!PageModel) {
            return res.status(500).json({ message: "Unable to load the model for the specified category" });
        }

        const pages = await PageModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $project: {
                    Availability: { $ifNull: ["$Availability", []] },
                    defaultLanguage: 1,
                    pagestyle: 1,
                },
            },
        ]);

        if (!pages || pages.length === 0) {
            return res.status(404).json({ message: "Page not found" });
        }

        res.status(200).json(pages[0]);
    } catch (error) {
        console.error("Error in getPageAvailability:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

