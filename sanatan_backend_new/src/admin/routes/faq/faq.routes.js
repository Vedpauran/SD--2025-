// routes.js

const express = require("express");
const router = express.Router();
const faqController = require("./faq.controller");

router.get("/", faqController.getAllFaqs); //all faq
router.get("/:id", faqController.getFaqById); // faq by id
router.get("/:id/:language", faqController.getFaqByLanguage); // faq
router.get("/trash", faqController.getTrashFaqs); //all trash faq
router.get("/active", faqController.getActiveFaqs); //all active faq
router.get("/draft", faqController.getDraftFaqs); //all draft faq
router.post("/", faqController.createFaq); //create faq
router.put("/:id", faqController.updateFaq); //update faq
router.delete("/:id", faqController.deleteFaq); //delete faq

module.exports = router;
