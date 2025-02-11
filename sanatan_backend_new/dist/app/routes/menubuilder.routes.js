const express = require("express");
const router = express.Router();
const AppMenu = require("../../admin/models/app-menu.modal");
const asyncHandler = require("../utils/asyncHandler");
router.get("/", asyncHandler(async (req, res) => {
  try {
    const appMenu = await AppMenu.findOne({
      Language: req.params.language
    });
    res.status(200).json(appMenu);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}));
module.exports = router;
//# sourceMappingURL=menubuilder.routes.js.map