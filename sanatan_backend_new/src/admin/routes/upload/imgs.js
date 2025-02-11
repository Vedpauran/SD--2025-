const express =require('express');
const router = express.Router();
const multer  = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/uploads/images")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'-'+file.originalname)
    },
  
})

const upload = multer({storage});

router.post('/',upload.single('file'), (req, res) => {
    var name = req.file.filename;
    var link = `uploads/images/${name}`;
    var oname = req.file.originalname;
      res.status(200).json({link:link,name:oname});
    });

router.post('/multiple',upload.array('file'), (req, res) => {
    const link = req.files.map(file => ({
       link: `uploads/images/${file.filename}`,
    }));
    
      res.status(200).json(link);
    });

  


module.exports = router;