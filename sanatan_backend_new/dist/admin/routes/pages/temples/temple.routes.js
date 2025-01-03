// routes.js

const express = require("express");
const router = express.Router();
const templeController = require("../../../controllers/pages/temple/temple.controller");
router.get("/", templeController.getAllTemples); //all temple
router.get("/:id", templeController.getTempleById); // temple by id
router.get("/:id/:language", templeController.getTempleByLanguage); // temple
router.get("/trash", templeController.getTrashTemples); //all trash temple
router.get("/active", templeController.getActiveTemples); //all active temple
router.get("/draft", templeController.getDraftTemples); //all draft temple
router.post("/", templeController.createTemple); //create temple
router.put("/:id", templeController.updateTemple); //update temple
router.delete("/:id", templeController.deleteTemple); //delete temple

module.exports = router;
//# sourceMappingURL=temple.routes.js.map