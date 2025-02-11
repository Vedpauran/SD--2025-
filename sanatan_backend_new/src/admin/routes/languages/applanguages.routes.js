// routes.js

const express = require("express");
const router = express.Router();
const applanguageController = require("../../controllers/languages/applanguages.controller");

router.get("/", applanguageController.getAllLanguages); //all pages
router.get("/find", applanguageController.FindLanguages); //find pages
router.get("/:id", applanguageController.getLanguageById); // pages by id
router.get("/trash", applanguageController.getTrashLanguages); //all trash pages
router.get("/active", applanguageController.getActiveLanguages); //all active pages
router.get("/draft", applanguageController.getDraftLanguages); //all draft pages
router.post("/", applanguageController.createLanguage); //create pages
router.put("/:id", applanguageController.updateLanguage); //update pages
router.delete("/:id", applanguageController.deleteLanguage); //delete pages
router.post("/deletemany", applanguageController.deleteLanguages); //delete pages

module.exports = router;
