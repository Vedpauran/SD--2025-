// scriptureController.js

const Scripture = require("../../../models/pages/scriptures");

// Get all scriptures
exports.getAllScriptures = async (req, res) => {
  try {
    const scriptures = await Scripture.find();
    res.json(scriptures);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get scripture by ID
exports.getScriptureById = async (req, res) => {
  try {
    const scripture = await Scripture.findById(req.params.id);
    if (!scripture) {
      return res.status(404).json({
        message: "Scripture not found"
      });
    }
    res.json(scripture);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
exports.getScriptureByLanguage = async (req, res) => {
  try {
    const Scriptures = await Scripture.findOne({
      Page: req.params.id,
      Language: req.params.language
    });
    if (!Scriptures) {
      return res.status(201).json({
        message: "Not Found"
      });
    }
    res.Scriptures = Scriptures;
    res.status(200).json(res.Scriptures);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
// Create a new scripture
exports.createScripture = async (req, res) => {
  const scripture = new Scripture(req.body);
  try {
    const newScripture = await scripture.save();
    res.status(201).json(newScripture);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Update scripture by ID
exports.updateScripture = async (req, res) => {
  try {
    const scripture = await Scripture.findById(req.params.id);
    if (!scripture) {
      return res.status(404).json({
        message: "Scripture not found"
      });
    }
    scripture.set(req.body);
    const updatedScripture = await scripture.save();
    res.json(updatedScripture);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Delete scripture by ID
exports.deleteScripture = async (req, res) => {
  try {
    const scripture = await Scripture.findById(req.params.id);
    if (!scripture) {
      return res.status(404).json({
        message: "Scripture not found"
      });
    }
    await scripture.remove();
    res.json({
      message: "Scripture deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get scriptures
exports.getActiveScriptures = async (req, res) => {
  try {
    const scripture = await Scripture.find({
      status: "STATUS_ACTIVE"
    });
    if (!scripture) {
      return res.status(404).json({
        message: "Scripture not found"
      });
    }
    res.json(scripture);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get scriptures
exports.getDraftScriptures = async (req, res) => {
  try {
    const scripture = await Scripture.find({
      status: "STATUS_INACTIVE"
    });
    if (!scripture) {
      return res.status(404).json({
        message: "Scripture not found"
      });
    }
    res.json(scripture);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get scriptures
exports.getTrashScriptures = async (req, res) => {
  try {
    const scripture = await Scripture.find({
      isTrash: true
    });
    if (!scripture) {
      return res.status(404).json({
        message: "Scripture not found"
      });
    }
    res.json(scripture);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
//# sourceMappingURL=scriptures.controller.js.map