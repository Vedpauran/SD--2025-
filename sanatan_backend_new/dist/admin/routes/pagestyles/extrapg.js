const express = require('express');
const router = express.Router();
const Extrapg = require('../../models/pages/extra');
const moment = require('moment');
router.get('/', async (req, res) => {
  try {
    const Extrapgs = await Extrapg.find();
    res.status(201).json(Extrapgs);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.post("/add", async (req, res) => {
  try {
    var date = moment().toString();
    const addExtra = await Extrapg.create(req.body);
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
    const ExtrapgUpdate = await Extrapg.findByIdAndUpdate(_id, req.body);
    res.status(200).json({
      msg: "Successfully Updated"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get('/:id', getExtrapg, (req, res) => {
  res.json(res.extrapg);
});
async function getExtrapg(req, res, next) {
  try {
    const extrapg = await Extrapg.findById(req.params.id);
    if (extrapg == '') {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.extrapg = extrapg;
    res.json(res.extrapg);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const ExtraDelete = await Extrapg.deleteOne({
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
//# sourceMappingURL=extrapg.js.map