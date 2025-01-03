// menuController.js

const Menu = require("../../models/app-menu.modal");

// Get all menus
exports.getAllMenus = async (req, res) => {
	try {
		const menus = await Menu.find();
		res.json(menus);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get menu by ID
exports.getMenuById = async (req, res) => {
	try {
		const menu = await Menu.findById(req.params.id);
		if (!menu) {
			return res.status(404).json({ message: "Menu not found" });
		}
		res.json(menu);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
// Get menu by Type
exports.getMenuByLanguage = async (req, res) => {
	try {
		const Menus = await Menu.findOne({
			Language: req.params.language,
		});
		if (!Menus) {
			return res.status(201).json({ message: "Not Found" });
		}
		res.Menus = Menus;
		res.status(200).json(res.Menus);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
// Create a new menu
exports.createMenu = async (req, res) => {
	const menu = new Menu(req.body);

	try {
		const newMenu = await menu.save();
		res.status(200).json(newMenu);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Update menu by ID
exports.updateMenu = async (req, res) => {
	try {
		const menu = await Menu.findById(req.params.id);
		if (!menu) {
			return res.status(404).json({ message: "Menu not found" });
		}

		menu.set(req.body);
		const updatedMenu = await menu.save();
		res.json(updatedMenu);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete menu by ID
exports.deleteMenu = async (req, res) => {
	try {
		const menu = await Menu.findById(req.params.id);
		if (!menu) {
			return res.status(404).json({ message: "Menu not found" });
		}

		await menu.remove();
		res.json({ message: "Menu deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
