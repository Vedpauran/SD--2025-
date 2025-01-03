// routes.js

const express = require("express");
const router = express.Router();
const menuController = require("../../controllers/menubuilder/menu.controller");
router.get("/", menuController.getAllMenus); //all menu
router.get("/:id", menuController.getMenuById); // menu by id
router.get("/language/:language", menuController.getMenuByLanguage); // menu
router.post("/", menuController.createMenu); //create menu
router.put("/:id", menuController.updateMenu); //update menu
router.delete("/:id", menuController.deleteMenu); //delete menu

module.exports = router;
//# sourceMappingURL=menu-builder.routes.js.map