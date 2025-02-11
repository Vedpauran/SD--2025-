// routes.js

const express = require("express");
const router = express.Router();
const scriptureController = require("../../../controllers/pages/scriptures/scriptures.controller");
router.get("/", scriptureController.getAllScriptures); //all scripture
router.get("/:id", scriptureController.getScriptureById); // scripture by id
router.get("/:id/:language", scriptureController.getScriptureByLanguage); // scripture
router.get("/trash", scriptureController.getTrashScriptures); //all trash scripture
router.get("/active", scriptureController.getActiveScriptures); //all active scripture
router.get("/draft", scriptureController.getDraftScriptures); //all draft scripture
router.post("/", scriptureController.createScripture); //create scripture
router.put("/:id", scriptureController.updateScripture); //update scripture
router.delete("/:id", scriptureController.deleteScripture); //delete scripture

module.exports = router;
//# sourceMappingURL=scriptures.routes.js.map