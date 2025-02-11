const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage
});
router.post('/', upload.single('file'), (req, res) => {
  var name = req.file.filename;
  var link = `uploads/videos/${name}`;
  var oname = req.file.originalname;
  res.status(200).json({
    link: link,
    name: oname
  });
});
module.exports = router;
//# sourceMappingURL=videos.js.map