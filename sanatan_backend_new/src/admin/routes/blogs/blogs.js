const express = require("express");
const router = express.Router();
const Blog = require("../../models/blogs/blog");
const BlogContent = require("../../models/blogs/blogcontent.model");
const moment = require("moment");
const asyncHandler = require("../../utils/asyncHandler");
const { default: mongoose } = require("mongoose");

//Blog Page Routes

router.get("/", async (req, res) => {
	try {
		const Blogs = await Blog.find();
		res.status(201).json(Blogs);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
router.get(
	"/find",
	asyncHandler(async (req, res) => {
		const type = req.query.type;

		try {
			if (type === "") {
				const result = await Blog.aggregate([
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
							activeBlogs: [
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
				]);
				res.json({
					totals: result[0].totals[0] || {
						totalActive: 0,
						totalDraft: 0,
					},
					activeBlogs: result[0].activeBlogs,
				});
			} else {
				const result = await Blog.aggregate([
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
							activeBlogs: [
								{
									$match: { status: type },
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
				]);
				res.json({
					totals: result[0].totals[0] || {
						totalActive: 0,
						totalDraft: 0,
					},
					activeBlogs: result[0].activeBlogs,
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	})
);

router.get("/:id", async (req, res) => {
	try {
		const Blogs = await Blog.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(req.params.id),
				},
			},
			{
				$addFields: {
					publish: {
						$ifNull: ["$publish", "$createdAt"],
					},
				},
			},
		]);
		if (!Blogs) {
			return res.status(404).json({ message: "Blogs not found" });
		}
		res.json(Blogs[0]);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

router.post("/add", async (req, res) => {
	try {
		const addBlog = await Blog.create(req.body);
		res.status(200).json(addBlog);
	} catch (error) {
		console.log(error);

		res.status(500).json({ message: error.message });
	}
});

router.put("/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const BlogUpdate = await Blog.findByIdAndUpdate(_id, req.body);
		res.status(200).json(BlogUpdate);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const Delete = await Blog.deleteOne({ _id });
		res.status(200).json({ msg: "Successfully Deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Blog Content Routes
router.post("/add/content", async (req, res) => {
	try {
		const addBlog = await BlogContent.create(req.body);
		res.status(200).json(addBlog);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/edit/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const BlogUpdate = await BlogContent.findByIdAndUpdate(
			_id,
			req.body
		);
		res.status(200).json({ msg: "Successfully Updated" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/add/content/:id/:lang", async (req, res) => {
	try {
		const Blogs = await BlogContent.findOne({
			Page: req.params.id,
			Language: req.params.lang,
		});
		if (!Blogs) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Blogs = Blogs;
		res.status(200).json(res.Blogs);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

router.get("/content/:id", async (req, res) => {
	try {
		const Blogs = await BlogContent.findById(req.params.id);
		if (!Blogs) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Blogs = Blogs;
		res.status(200).json(res.Blogs);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

module.exports = router;
