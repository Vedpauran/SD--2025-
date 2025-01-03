// notificationController.js

const Notification = require("../../models/notification/notification");

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
// Get notification by Type
exports.getNotificationByLanguage = async (req, res) => {
  try {
    const Notifications = await Notification.findOne({
      Page: req.params.id,
      Language: req.params.language
    });
    if (!Notifications) {
      return res.status(201).json({
        message: "Not Found"
      });
    }
    res.Notifications = Notifications;
    res.status(200).json(res.Notifications);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
// Create a new notification
exports.createNotification = async (req, res) => {
  const notification = new Notification(req.body);
  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Update notification by ID
exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }
    notification.set(req.body);
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Delete notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }
    res.json({
      message: "Notification deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Get notifications
exports.getTrashNotifications = async (req, res) => {
  try {
    const notification = await Notification.find({
      isTrash: true
    });
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
//# sourceMappingURL=notification.controller.js.map