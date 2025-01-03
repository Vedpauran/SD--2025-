// routes.js

const express = require("express");
const router = express.Router();
const languageController = require("../../controllers/languages/languages.controller");

router.get("/", languageController.getAllLanguages); //all pages
router.get("/find", languageController.FindLanguages); //all pages
router.get("/:id", languageController.getLanguageById); // pages by id
router.post("/", languageController.createLanguage); //create pages
router.put("/:id", languageController.updateLanguage); //update pages
router.delete("/:id", languageController.deleteLanguage); //delete pages
router.post("/deletemany", languageController.deleteLanguages); //delete pages

module.exports = router;
