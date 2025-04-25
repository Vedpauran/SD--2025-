// routes.js

const express = require("express");
const router = express.Router();
const tableController = require("../../../controllers/pages/table/table.controller");

router.get("/", tableController.getAllTables); //all table
router.get("/:id", tableController.getTableById); // table by id
router.get("/:id/:language", tableController.getTableByLanguage); // table
router.get("/trash", tableController.getTrashTable); //all trash table
router.get("/active", tableController.getActiveTables); //all active table
router.get("/draft", tableController.getDraftTable); //all draft table
router.post("/", tableController.createTable); //create table
router.put("/:id", tableController.updateTable); //update table
router.delete("/:id", tableController.deleteTable); //delete table

router.post("/save", tableController.saveTableData);
router.post("/delete", tableController.deleteTableData);

router.post("/savefaq", tableController.saveFaq);
router.post("/deletefaq", tableController.deleteFaq);

module.exports = router;
