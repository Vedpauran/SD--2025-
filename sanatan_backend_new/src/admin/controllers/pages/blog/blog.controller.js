// blogController.js

const Blog = require("../../../models/pages/pageblog");

// Get all blogs
exports.getAllBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find();
		res.json(blogs);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);
		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}
		res.json(blog);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
// Get blog by Type
exports.getBlogByLanguage = async (req, res) => {
	try {
		const Blogs = await Blog.findOne({
			Page: req.params.id,
			Language: req.params.language,
		});
		if (!Blogs) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Blogs = Blogs;
		res.status(200).json(res.Blogs);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
// Create a new blog
exports.createBlog = async (req, res) => {
	const blog = new Blog(req.body);

	try {
		const newBlog = await blog.save();
		res.status(201).json(newBlog);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Update blog by ID
exports.updateBlog = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);
		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}

		blog.set(req.body);
		const updatedBlog = await blog.save();
		res.json(updatedBlog);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete blog by ID
exports.deleteBlog = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);
		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}

		await blog.remove();
		res.json({ message: "Blog deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get blogs
exports.getActiveBlogs = async (req, res) => {
	try {
		const blog = await Blog.find({
			status: "STATUS_ACTIVE",
		});
		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}
		res.json(blog);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get blogs
exports.getDraftBlogs = async (req, res) => {
	try {
		const blog = await Blog.find({
			status: "STATUS_INACTIVE",
		});
		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}
		res.json(blog);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get blogs
exports.getTrashBlogs = async (req, res) => {
	try {
		const blog = await Blog.find({ isTrash: true });
		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}
		res.json(blog);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
