// faqController.js

const Faq = require("../../models/faqcontent");

// Get all faqs
exports.getAllFaqs = async (req, res) => {
	try {
		const faqs = await Faq.find();
		res.json(faqs);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get faq by ID
exports.getFaqById = async (req, res) => {
	try {
		const faq = await Faq.findById(req.params.id);
		if (!faq) {
			return res.status(404).json({ message: "Faq not found" });
		}
		res.json(faq);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
// Get faq by Type
exports.getFaqByLanguage = async (req, res) => {
	try {
		const Faqs = await Faq.findOne({
			Page: req.params.id,
			Language: req.params.language,
		});
		if (!Faqs) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Faqs = Faqs;
		res.status(200).json(res.Faqs);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
// Create a new faq
exports.createFaq = async (req, res) => {
	const faq = new Faq(req.body);

	try {
		const newFaq = await faq.save();
		res.status(201).json(newFaq);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Update faq by ID
exports.updateFaq = async (req, res) => {
	try {
		const faq = await Faq.findById(req.params.id);
		if (!faq) {
			return res.status(404).json({ message: "Faq not found" });
		}

		faq.set(req.body);
		const updatedFaq = await faq.save();
		res.json(updatedFaq);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete faq by ID
exports.deleteFaq = async (req, res) => {
	try {
		const faq = await Faq.findById(req.params.id);
		if (!faq) {
			return res.status(404).json({ message: "Faq not found" });
		}

		await faq.remove();
		res.json({ message: "Faq deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get faqs
exports.getActiveFaqs = async (req, res) => {
	try {
		const faq = await Faq.find({ status: "STATUS_ACTIVE" });
		if (!faq) {
			return res.status(404).json({ message: "Faq not found" });
		}
		res.json(faq);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get faqs
exports.getDraftFaqs = async (req, res) => {
	try {
		const faq = await Faq.find({
			status: "STATUS_INACTIVE",
		});
		if (!faq) {
			return res.status(404).json({ message: "Faq not found" });
		}
		res.json(faq);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get faqs
exports.getTrashFaqs = async (req, res) => {
	try {
		const faq = await Faq.find({ isTrash: true });
		if (!faq) {
			return res.status(404).json({ message: "Faq not found" });
		}
		res.json(faq);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
