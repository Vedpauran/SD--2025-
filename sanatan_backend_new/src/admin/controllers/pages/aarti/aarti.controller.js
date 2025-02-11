// aartiController.js

const Aarti = require("../../../models/pages/aarti");

// Get all aartis
exports.getAllAartis = async (req, res) => {
	try {
		const aartis = await Aarti.find();
		res.json(aartis);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get aarti by ID
exports.getAartiById = async (req, res) => {
	try {
		const aarti = await Aarti.findById(req.params.id);
		if (!aarti) {
			return res.status(404).json({ message: "Aarti not found" });
		}
		res.json(aarti);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
// Get aarti by Type
exports.getAartiByLanguage = async (req, res) => {
	try {
		const Aartis = await Aarti.findOne({
			Page: req.params.id,
			Language: req.params.language,
		});
		if (!Aartis) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Aartis = Aartis;
		res.status(200).json(res.Aartis);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
// Create a new aarti
exports.createAarti = async (req, res) => {
	const aarti = new Aarti(req.body);

	try {
		const newAarti = await aarti.save();
		res.status(201).json(newAarti);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Update aarti by ID
exports.updateAarti = async (req, res) => {
	try {
		const aarti = await Aarti.findById(req.params.id);
		if (!aarti) {
			return res.status(404).json({ message: "Aarti not found" });
		}

		aarti.set(req.body);
		const updatedAarti = await aarti.save();
		res.json(updatedAarti);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete aarti by ID
exports.deleteAarti = async (req, res) => {
	try {
		const aarti = await Aarti.findById(req.params.id);
		if (!aarti) {
			return res.status(404).json({ message: "Aarti not found" });
		}

		await aarti.remove();
		res.json({ message: "Aarti deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get aartis
exports.getActiveAartis = async (req, res) => {
	try {
		const aarti = await Aarti.find({ status: "STATUS_ACTIVE" });
		if (!aarti) {
			return res.status(404).json({ message: "Aarti not found" });
		}
		res.json(aarti);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get aartis
exports.getDraftAartis = async (req, res) => {
	try {
		const aarti = await Aarti.find({
			status: "STATUS_INACTIVE",
		});
		if (!aarti) {
			return res.status(404).json({ message: "Aarti not found" });
		}
		res.json(aarti);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get aartis
exports.getTrashAartis = async (req, res) => {
	try {
		const aarti = await Aarti.find({ isTrash: true });
		if (!aarti) {
			return res.status(404).json({ message: "Aarti not found" });
		}
		res.json(aarti);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
