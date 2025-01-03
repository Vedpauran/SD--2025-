// routes.js

const express = require("express");
const router = express.Router();
const faqController = require("./faqpage.controller");
router.get("/faq", faqController.getAllFaqs); //all faq
router.get("/faq/:id", faqController.getFaqById); // faq by id
router.get("/faq/:id/:language", faqController.getFaqByLanguage); // faq
router.get("/faq/trash", faqController.getTrashFaqs); //all trash faq
router.get("/faq/active", faqController.getActiveFaqs); //all active faq
router.get("/faq/draft", faqController.getDraftFaqs); //all draft faq
router.post("/faq", faqController.createFaq); //create faq
router.put("/faq/:id", faqController.updateFaq); //update faq
router.delete("/faq/:id", faqController.deleteFaq); //delete faq

module.exports = router;
//# sourceMappingURL=faq.page.routes.js.map