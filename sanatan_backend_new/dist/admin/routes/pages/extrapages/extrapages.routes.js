// routes.js

const express = require("express");
const router = express.Router();
const extrapageController = require("../../../controllers/pages/extrapages/extrapages.controller");
router.get("/", extrapageController.getAllExtrapages); //all extrapage
router.get("/:id", extrapageController.getExtrapageById); // extrapage by id
router.get("/:id/:language", extrapageController.getExtrapageByLanguage); // extrapage
router.get("/trash", extrapageController.getTrashExtrapages); //all trash extrapage
router.get("/active", extrapageController.getActiveExtrapages); //all active extrapage
router.get("/draft", extrapageController.getDraftExtrapages); //all draft extrapage
router.post("/", extrapageController.createExtrapage); //create extrapage
router.put("/:id", extrapageController.updateExtrapage); //update extrapage
router.delete("/:id", extrapageController.deleteExtrapage); //delete extrapage

module.exports = router;
//# sourceMappingURL=extrapages.routes.js.map