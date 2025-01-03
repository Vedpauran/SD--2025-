// whatsnewController.js

const WhatsnewModal = require("../../models/whatsnew/whatsnewContent");

// Get all whatsnews
exports.getAllWhatsnews = async (req, res) => {
  try {
    const whatsnews = await WhatsnewModal.find();
    res.json(whatsnews);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get whatsnew by ID
exports.getWhatsnewById = async (req, res) => {
  try {
    const whatsnew = await WhatsnewModal.findById(req.params.id);
    if (!whatsnew) {
      return res.status(404).json({
        message: "Whatsnew not found"
      });
    }
    res.json(whatsnew);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
// Get whatsnew by Type
exports.getWhatsnewByLanguage = async (req, res) => {
  try {
    const Whatsnews = await WhatsnewModal.findOne({
      Page: req.params.id,
      Language: req.params.language
    });
    if (!Whatsnews) {
      return res.status(201).json({
        message: "Not Found"
      });
    }
    res.Whatsnews = Whatsnews;
    res.status(200).json(res.Whatsnews);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
// Create a new whatsnew
exports.createWhatsnew = async (req, res) => {
  const whatsnew = new Whatsnew(req.body);
  try {
    const newWhatsnew = await whatsnew.save();
    res.status(201).json(newWhatsnew);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Update whatsnew by ID
exports.updateWhatsnew = async (req, res) => {
  try {
    const whatsnew = await WhatsnewModal.findById(req.params.id);
    if (!whatsnew) {
      return res.status(404).json({
        message: "Whatsnew not found"
      });
    }
    whatsnew.set(req.body);
    const updatedWhatsnew = await whatsnew.save();
    res.json(updatedWhatsnew);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Delete whatsnew by ID
exports.deleteWhatsnew = async (req, res) => {
  try {
    const whatsnew = await WhatsnewModal.findByIdAndDelete(req.params.id);
    if (!whatsnew) {
      return res.status(404).json({
        message: "Whatsnew not found"
      });
    }
    res.json({
      message: "Whatsnew deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get whatsnews
exports.getTrashWhatsnews = async (req, res) => {
  try {
    const whatsnew = await WhatsnewModal.find({
      isTrash: true
    });
    if (!whatsnew) {
      return res.status(404).json({
        message: "Whatsnew not found"
      });
    }
    res.json(whatsnew);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
//# sourceMappingURL=whatsnewContent.controller.js.map