// routes.js

const express = require("express");
const router = express.Router();
const whatsNewController = require("./whatsnewContent.controller");
router.get("/", whatsNewController.getAllWhatsnews); //all faq
router.get("/:id", whatsNewController.getWhatsnewById); // faq by id
router.get("/:id/:language", whatsNewController.getWhatsnewByLanguage); // faq
router.post("/", whatsNewController.createWhatsnew); //create faq
router.put("/:id", whatsNewController.updateWhatsnew); //update faq
router.delete("/:id", whatsNewController.deleteWhatsnew); //delete faq

module.exports = router;
//# sourceMappingURL=whatsnewContent.routes.js.map