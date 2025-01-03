const express = require('express');
const router = express.Router();
const Hero = require('../../models/hero');
const moment = require('moment');
router.get('/', async (req, res) => {
  try {
    const heros = await Hero.find();
    res.status(201).json(heros);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
router.get('/:id', gethero, (req, res) => {
  res.json(res.hero);
});
async function gethero(req, res, next) {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.hero = hero;
    res.json(res.hero);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
router.post("/add", async (req, res) => {
  try {
    const addhero = Hero.create(req.body);
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
    const UpdateHero = await Hero.findByIdAndUpdate(_id, req.body);
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
    const deletehero = await Hero.deleteOne({
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
//# sourceMappingURL=hero.js.map