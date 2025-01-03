const express = require("express");
const router = express.Router();
const Social = require("../../models/social");
const moment = require("moment");
router.get("/", async (req, res) => {
  try {
    const Socials = await Social.find();
    res.status(200).json(Socials);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.post("/add", async (req, res) => {
  try {
    const AddItem = Social.create(req.body);
    res.status(200).json({
      msg: "Successfully Added"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const SocialDelete = await Social.findByIdAndDelete(_id);
    res.status(200).json({
      msg: "Successfully Deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const UpdateSocial = await Social.findByIdAndUpdate(_id, req.body);
    res.status(200).json("success");
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get("/:id", getSocialmedia, (req, res) => {
  res.json(res.social);
});
async function getSocialmedia(req, res, next) {
  try {
    const social = await Social.findById(req.params.id);
    if (social == "") {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.social = social;
    res.json(res.social);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
module.exports = router;
//# sourceMappingURL=social.js.map