// templeController.js

const Temple = require("../../../models/pages/temples");

// Get all temples
exports.getAllTemples = async (req, res) => {
  try {
    const temples = await Temple.find();
    res.json(temples);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get temple by ID
exports.getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({
        message: "Temple not found"
      });
    }
    res.json(temple);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
exports.getTempleByLanguage = async (req, res) => {
  try {
    const Temples = await Temple.findOne({
      Page: req.params.id,
      Language: req.params.language
    });
    if (!Temples) {
      return res.status(201).json({
        message: "Not Found"
      });
    }
    res.Temples = Temples;
    res.status(200).json(res.Temples);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
// Create a new temple
exports.createTemple = async (req, res) => {
  const temple = new Temple(req.body);
  try {
    const newTemple = await temple.save();
    res.status(201).json(newTemple);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Update temple by ID
exports.updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({
        message: "Temple not found"
      });
    }
    temple.set(req.body);
    const updatedTemple = await temple.save();
    res.json(updatedTemple);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Delete temple by ID
exports.deleteTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({
        message: "Temple not found"
      });
    }
    await temple.remove();
    res.json({
      message: "Temple deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get temples
exports.getActiveTemples = async (req, res) => {
  try {
    const temple = await Temple.find({
      status: "STATUS_ACTIVE"
    });
    if (!temple) {
      return res.status(404).json({
        message: "Temple not found"
      });
    }
    res.json(temple);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get temples
exports.getDraftTemples = async (req, res) => {
  try {
    const temple = await Temple.find({
      status: "STATUS_INACTIVE"
    });
    if (!temple) {
      return res.status(404).json({
        message: "Temple not found"
      });
    }
    res.json(temple);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get temples
exports.getTrashTemples = async (req, res) => {
  try {
    const temple = await Temple.find({
      isTrash: true
    });
    if (!temple) {
      return res.status(404).json({
        message: "Temple not found"
      });
    }
    res.json(temple);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
//# sourceMappingURL=temple.controller.js.map