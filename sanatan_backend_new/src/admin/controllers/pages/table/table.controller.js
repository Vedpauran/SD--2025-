const Table = require("../../../models/pages/tableStyle");

// Get all records
exports.getAllTables = async (req, res) => {
  try {
    const records = await Table.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get record by ID
exports.getTableById = async (req, res) => {
  try {
    const record = await Table.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get record by Page and Language
exports.getTableByLanguage = async (req, res) => {
  try {
    const record = await Table.findOne({
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
exports.createTable = async (req, res) => {
  const record = new Table(req.body);

  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update record by ID
exports.updateTable = async (req, res) => {
  try {
    const record = await Table.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Table not found" });
    }
    record.set(req.body);
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete record by ID
exports.deleteTable = async (req, res) => {
  try {
    const record = await Table.findById(req.params.id);
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
exports.getActiveTables = async (req, res) => {
  try {
    const records = await Table.find({ status: "STATUS_ACTIVE" });
    if (!records.length) {
      return res.status(404).json({ message: "No active records found" });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get draft records
exports.getDraftTable = async (req, res) => {
  try {
    const records = await Table.find({ status: "STATUS_INACTIVE" });
    if (!records.length) {
      return res.status(404).json({ message: "No draft records found" });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get trashed records
exports.getTrashTable = async (req, res) => {
  try {
    const records = await Table.find({ isTrash: true });
    if (!records.length) {
      return res.status(404).json({ message: "No trashed records found" });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Save only table data (append to tables array or replace existing)
exports.saveTableData = async (req, res) => {
  try {
    const { Page, Language, table } = req.body;

    const record = await Table.findOne({ Page, Language });
    if (!record) {
      return res.status(404).json({ message: "Page record not found." });
    }

    // Append new table to existing tables
    record.tables.push(table);
    const updated = await record.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// filepath: d:\sanatandharmaya\SD--2025-\sanatan_backend_new\src\admin\controllers\pages\table\table.controller.js
exports.deleteTableData = async (req, res) => {
  try {
    const { Page, Language, tableName } = req.body;

    const record = await Table.findOne({ Page, Language });
    if (!record) {
      return res.status(404).json({ message: "Page record not found." });
    }

    // Remove the table with the specified name
    record.tables = record.tables.filter(
      (table) => table.tableName !== tableName
    );

    const updated = await record.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveFaq = async (req, res) => {
  try {
    const { Page, Language, faq } = req.body;

    const record = await Table.findOne({ Page, Language });
    if (!record) {
      return res.status(404).json({ message: "Page record not found." });
    }

    // Append new table to existing tables
    record.faqs.push(faq);
    const updated = await record.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { Page, Language, faqtitle } = req.body;

    const record = await Table.findOne({ Page, Language });
    if (!record) {
      return res.status(404).json({ message: "Page record not found." });
    }

    // Remove the table with the specified name
    record.faqs = record.faqs.filter((faq) => faq.faqtitle !== faqtitle);

    const updated = await record.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
