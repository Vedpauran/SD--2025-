// routes.js

const express = require("express");
const router = express.Router();
const NotificationController = require("./notification.controller");
router.get("/", NotificationController.getAllNotifications); //all faq
router.get("/:id", NotificationController.getNotificationById); // faq by id
router.get("/:id/:language", NotificationController.getNotificationByLanguage); // faq
router.post("/", NotificationController.createNotification); //create faq
router.put("/:id", NotificationController.updateNotification); //update faq
router.delete("/:id", NotificationController.deleteNotification); //delete faq

module.exports = router;
//# sourceMappingURL=notification.routes.js.map