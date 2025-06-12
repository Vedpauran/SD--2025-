const Chalisa = require("../../../models/pages/chalisa");

// Get all records
exports.getAllChalisa = async (req, res) => {
  try {
    const records = await Chalisa.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get record by ID
exports.getChalisaById = async (req, res) => {
  try {
    const record = await Chalisa.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get record by Page and Language
exports.getChalisaByLanguage = async (req, res) => {
  try {
    const record = await Chalisa.findOne({
      Page: req.params.id,
      Language: req.params.language,
    });
    if (!record) {
      return res.status(201).json({ message: "Not Found" });
    }
    res.json(record);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a new record
exports.createChalisa = async (req, res) => {
  const record = new Chalisa(req.body);

  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update record by ID
exports.updateChalisa = async (req, res) => {
  try {
    const record = await Chalisa.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Chalisa not found" });
    }
    record.set(req.body);
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete record by ID
exports.deleteChalisa = async (req, res) => {
  try {
    const record = await Chalisa.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    await record.remove();
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get active records
exports.getActiveChalisa = async (req, res) => {
  try {
    const records = await Chalisa.find({ status: "STATUS_ACTIVE" });
    if (!records.length) {
      return res.status(404).json({ message: "No active records found" });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get draft records
exports.getDraftChalisa = async (req, res) => {
  try {
    const records = await Chalisa.find({ status: "STATUS_INACTIVE" });
    if (!records.length) {
      return res.status(404).json({ message: "No draft records found" });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get trashed records
exports.getTrashChalisa = async (req, res) => {
  try {
    const records = await Chalisa.find({ isTrash: true });
    if (!records.length) {
      return res.status(404).json({ message: "No trashed records found" });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a specific chapter by index
exports.deleteChapter = async (req, res) => {
  try {
    const { id, chapterIndex } = req.params;

    // Find the Chalisa record
    const record = await Chalisa.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Chalisa not found" });
    }

    // Remove the chapter at the specified index
    if (record.chapters && record.chapters.length > chapterIndex) {
      record.chapters.splice(chapterIndex, 1);
      await record.save();
      return res
        .status(200)
        .json({ message: "Chapter deleted successfully", record });
    } else {
      return res.status(400).json({ message: "Invalid chapter index" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Save chapters to the Chalisa record
exports.saveChapters = async (req, res) => {
  try {
    const { id } = req.params;
    const { chapters } = req.body;

    // Find the Chalisa record by ID
    const record = await Chalisa.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Chalisa not found" });
    }

    // Update the chapters field
    record.chapters = chapters;
    await record.save();

    res.status(200).json({
      message: "Chapters saved successfully",
      chapters: record.chapters,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a specific verse from a chapter
exports.deleteVerse = async (req, res) => {
  try {
    const { id, chapterIndex, verseIndex } = req.params;

    // Find the Chalisa record
    const record = await Chalisa.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Chalisa not found" });
    }

    // Check chapter and verse existence
    if (
      record.chapters &&
      record.chapters.length > chapterIndex &&
      record.chapters[chapterIndex].verses &&
      record.chapters[chapterIndex].verses.length > verseIndex
    ) {
      record.chapters[chapterIndex].verses.splice(verseIndex, 1);
      await record.save();
      return res
        .status(200)
        .json({ message: "Verse deleted successfully", record });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid chapter or verse index" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
