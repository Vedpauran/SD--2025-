// routes.js

const express = require("express");
const router = express.Router();
const chalisaController = require("../../../controllers/pages/chalisa/chalisa.controller");

router.get("/", chalisaController.getAllChalisa);
router.get("/:id", chalisaController.getChalisaById);
router.get("/:id/:language", chalisaController.getChalisaByLanguage);
router.get("/trash", chalisaController.getTrashChalisa);
router.get("/active", chalisaController.getActiveChalisa);
router.get("/draft", chalisaController.getDraftChalisa);
router.post("/", chalisaController.createChalisa);
router.put("/:id", chalisaController.updateChalisa);
router.delete("/:id", chalisaController.deleteChalisa);

router.delete("/:id/chapter/:chapterIndex", chalisaController.deleteChapter);
router.put("/:id/chapters", chalisaController.saveChapters); // Save chapters

module.exports = router;
