// routes.js

const express = require("express");
const router = express.Router();
const aartiController = require("../../../controllers/pages/aarti/aarti.controller");

router.get("/", aartiController.getAllAartis); //all aarti
router.get("/:id", aartiController.getAartiById); // aarti by id
router.get("/:id/:language", aartiController.getAartiByLanguage); // aarti
router.get("/trash", aartiController.getTrashAartis); //all trash aarti
router.get("/active", aartiController.getActiveAartis); //all active aarti
router.get("/draft", aartiController.getDraftAartis); //all draft aarti
router.post("/", aartiController.createAarti); //create aarti
router.put("/:id", aartiController.updateAarti); //update aarti
router.delete("/:id", aartiController.deleteAarti); //delete aarti

module.exports = router;
