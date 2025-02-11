const express = require('express');
const router = express.Router();
const Temple = require('../../models/pages/temples');
const moment = require('moment');
router.get('/', async (req, res) => {
  try {
    const Temples = await Temple.find();
    res.status(201).json(Temples);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.post("/add", async (req, res) => {
  try {
    const addtemple = Temple.create(req.body);
    res.status(200).json({
      msg: "Successfully Added"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get('/:id', getTemple, (req, res) => {
  res.json(res.temple);
});
async function getTemple(req, res, next) {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.temple = temple;
    res.json(res.temple);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const UpdateTemple = await Temple.findByIdAndUpdate(_id, req.body);
    res.status(200).json({
      msg: "Successfully Updated"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const TempleDelete = await Temple.deleteOne({
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
//# sourceMappingURL=temples.js.map