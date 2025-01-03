const express = require("express");
const router = express.Router();
const Pages = require("../../models/pages/page.modal");
const AartiContent = require("../../models/pages/aarti");
const ExtraContent = require("../../models/pages/extra");
const TempleContent = require("../../models/pages/temples");
const BlogContent = require("../../models/pages/pageblog");
const ScriptureContent = require("../../models/pages/scriptures");

router.get("/count", async (req, res) => {
	try {
		data = Pages.countDocuments();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
router.post("/deletemany", async (req, res) => {
	const idarray = req.body;
	try {
		const deletePage = await Pages.deleteMany({
			_id: { $in: idarray },
		});
		res.status(200).json({ msg: "Successfully Deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
router.get("/", async (req, res) => {
	try {
		data = Pages.countDocuments();
		const allpages = await Pages.find();
		res.status(200).json(allpages);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
router.get("/:id", async (req, res) => {
	try {
		data = await Pages.findById(req.params.id);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/add", async (req, res) => {
	try {
		const AddPage = await Pages.create(req.body);
		res.status(200).json(AddPage);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const UpdatePage = await Pages.findByIdAndUpdate(_id, req.body);
		res.status(200).json(UpdatePage);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const deletePage = await Pages.deleteOne({ _id });
		res.status(200).json({ msg: "Successfully Deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Aarti Routes

router.post("/add/aarti", async (req, res) => {
	try {
		const addAarti = await AartiContent.create(req.body);
		res.status(200).json(addAarti);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/aarti/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const AartiUpdate = await AartiContent.findByIdAndUpdate(
			_id,
			req.body
		);
		res.status(200).json({ msg: "Successfully Updated" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/aarti/:id/:lang", async (req, res) => {
	try {
		const Aartis = await AartiContent.findOne({
			Page: req.params.id,
			Language: req.params.lang,
		});
		if (!Aartis) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Aartis = Aartis;
		res.status(200).json(res.Aartis);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});
router.get("/aarti/:id", async (req, res) => {
	try {
		const Aartis = await AartiContent.findById(req.params.id);
		if (!Aartis) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Aartis = Aartis;
		res.status(200).json(res.Aartis);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// Temple Routes

router.post("/add/temple", async (req, res) => {
	try {
		const addTemple = await TempleContent.create(req.body);
		res.status(200).json(addTemple);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/temple/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const TempleUpdate = await TempleContent.findByIdAndUpdate(
			_id,
			req.body
		);
		res.status(200).json({ msg: "Successfully Updated" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/temple/:id/:lang", async (req, res) => {
	try {
		const Temples = await TempleContent.findOne({
			Page: req.params.id,
			Language: req.params.lang,
		});
		if (!Temples) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Temples = Temples;
		res.status(200).json(res.Temples);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});
router.get("/temple/:id", async (req, res) => {
	try {
		const Temples = await TempleContent.findById(req.params.id);
		if (!Temples) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Temples = Temples;
		res.status(200).json(res.Temples);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// Extra Routes

router.post("/add/extra", async (req, res) => {
	try {
		const addextra = await ExtraContent.create(req.body);
		res.status(200).json(addextra);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/extra/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const ExtraUpdate = await ExtraContent.findByIdAndUpdate(
			_id,
			req.body
		);
		res.status(200).json({ msg: "Successfully Updated" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/extra/:id/:lang", async (req, res) => {
	try {
		const Extras = await ExtraContent.findOne({
			Page: req.params.id,
			Language: req.params.lang,
		});
		if (!Extras) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Extras = Extras;
		res.status(200).json(res.Extras);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});
router.get("/extra/:id", async (req, res) => {
	try {
		const Extras = await ExtraContent.findById(req.params.id);
		if (!Extras) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Extras = Extras;
		res.status(200).json(res.Extras);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// Blog Routes

router.post("/add/blog", async (req, res) => {
	try {
		const addBlog = await BlogContent.create(req.body);
		res.status(200).json(addBlog);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/blog/:id", async (req, res) => {
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

router.get("/blog/:id/:lang", async (req, res) => {
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
router.get("/blog/:id", async (req, res) => {
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

// Scripture Routes

router.post("/add/scripture", async (req, res) => {
	try {
		const addScripture = await ScriptureContent.create(req.body);
		res.status(200).json(addScripture);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/scripture/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const ScriptureUpdate = await ScriptureContent.findByIdAndUpdate(
			_id,
			req.body
		);
		res.status(200).json({ msg: "Successfully Updated" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/scripture/:id/:lang", async (req, res) => {
	try {
		const Scriptures = await ScriptureContent.findOne({
			Page: req.params.id,
			Language: req.params.lang,
		});
		if (!Scriptures) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Scriptures = Scriptures;
		res.status(200).json(res.Scriptures);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});
router.get("/scripture/:id", async (req, res) => {
	try {
		const Scriptures = await ScriptureContent.findById(req.params.id);
		if (!Scriptures) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Scriptures = Scriptures;
		res.status(200).json(res.Scriptures);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

module.exports = router;
