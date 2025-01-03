const express = require("express");
const router = express.Router();
const feedback = require("../../../app/models/users/feedback");
router.get("/", async (req, res) => {
  try {
    const users = await feedback.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/:id", getFeedBack, (req, res) => {
  res.json(res.feedback);
});
async function getFeedBack(req, res, next) {
  try {
    const feedbacks = await feedback.findById(req.params.id);
    if (feedbacks == "") {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.feedback = feedbacks;
    res.json(res.feedback);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
module.exports = router;
//# sourceMappingURL=feedback.js.map