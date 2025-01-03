const express = require('express');
const router = express.Router();
const Aarti = require('../../models/pages/aarti');
const moment = require('moment');
router.get('/', async (req, res) => {
  try {
    const aartis = await Aarti.find();
    res.status(201).json(aartis);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get('/:id', getaarti, (req, res) => {
  res.json(res.aarti);
});
async function getaarti(req, res, next) {
  try {
    const aarti = await Aarti.findById(req.params.id);
    if (!aarti) {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.aarti = aarti;
    res.json(res.aarti);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
router.post("/add", async (req, res) => {
  try {
    const addaarti = Aarti.create(req.body);
    res.status(200).json({
      msg: "Successfully Added"
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
    const UpdateAarti = await Aarti.findByIdAndUpdate(_id, req.body);
    res.status(200).json({
      msg: "Successfully Updated"
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
    const deleteaarti = await Aarti.deleteOne({
      _id
    });
    res.status(200).json({
      msg: "Successfully Deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;
//# sourceMappingURL=aarti.js.map