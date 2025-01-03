// extrapageController.js

const Extrapage = require("../../../models/pages/extra");

// Get all extrapages
exports.getAllExtrapages = async (req, res) => {
  try {
    const extrapages = await Extrapage.find();
    res.json(extrapages);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get extrapage by ID
exports.getExtrapageById = async (req, res) => {
  try {
    const extrapage = await Extrapage.findById(req.params.id);
    if (!extrapage) {
      return res.status(404).json({
        message: "Extrapage not found"
      });
    }
    res.json(extrapage);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
// Get extrapage by Type
exports.getExtrapageByLanguage = async (req, res) => {
  try {
    const Extrapages = await Extrapage.findOne({
      Page: req.params.id,
      Language: req.params.language
    });
    if (!Extrapages) {
      return res.status(201).json({
        message: "Not Found"
      });
    }
    res.Extrapages = Extrapages;
    res.status(200).json(res.Extrapages);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
// Create a new extrapage
exports.createExtrapage = async (req, res) => {
  const extrapage = new Extrapage(req.body);
  try {
    const newExtrapage = await extrapage.save();
    res.status(201).json(newExtrapage);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Update extrapage by ID
exports.updateExtrapage = async (req, res) => {
  try {
    const extrapage = await Extrapage.findById(req.params.id);
    if (!extrapage) {
      return res.status(404).json({
        message: "Extrapage not found"
      });
    }
    extrapage.set(req.body);
    const updatedExtrapage = await extrapage.save();
    res.json(updatedExtrapage);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Delete extrapage by ID
exports.deleteExtrapage = async (req, res) => {
  try {
    const extrapage = await Extrapage.findById(req.params.id);
    if (!extrapage) {
      return res.status(404).json({
        message: "Extrapage not found"
      });
    }
    await extrapage.remove();
    res.json({
      message: "Extrapage deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get extrapages
exports.getActiveExtrapages = async (req, res) => {
  try {
    const extrapage = await Extrapage.find({
      status: "STATUS_ACTIVE"
    });
    if (!extrapage) {
      return res.status(404).json({
        message: "Extrapage not found"
      });
    }
    res.json(extrapage);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get extrapages
exports.getDraftExtrapages = async (req, res) => {
  try {
    const extrapage = await Extrapage.find({
      status: "STATUS_INACTIVE"
    });
    if (!extrapage) {
      return res.status(404).json({
        message: "Extrapage not found"
      });
    }
    res.json(extrapage);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get extrapages
exports.getTrashExtrapages = async (req, res) => {
  try {
    const extrapage = await Extrapage.find({
      isTrash: true
    });
    if (!extrapage) {
      return res.status(404).json({
        message: "Extrapage not found"
      });
    }
    res.json(extrapage);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
//# sourceMappingURL=extrapages.controller.js.map