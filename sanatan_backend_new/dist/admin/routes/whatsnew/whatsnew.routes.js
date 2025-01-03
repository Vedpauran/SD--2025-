// routes.js

const express = require("express");
const router = express.Router();
const whatsnewController = require("./whatsnew.controller");
router.get("/", whatsnewController.getAllWhatsnews); //all whatsnew
router.get("/:id", whatsnewController.getWhatsnewById); // whatsnew by id
router.get("/:id/:language", whatsnewController.getWhatsnewByLanguage); // whatsnew
router.get("/trash", whatsnewController.getTrashWhatsnews); //all trash whatsnew
router.post("/", whatsnewController.createWhatsnew); //create whatsnew
router.put("/:id", whatsnewController.updateWhatsnew); //update whatsnew
router.delete("/:id", whatsnewController.deleteWhatsnew); //delete whatsnew

module.exports = router;
//# sourceMappingURL=whatsnew.routes.js.map