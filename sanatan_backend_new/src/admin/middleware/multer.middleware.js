const express =require('express');
const router = express.Router();
const multer  = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/uploads")
    },
    filename:function(req,file,cb){
       return cb(null, Date.now()+'-'+file.originalname);
    },
  
})
 
const upload = multer({storage});
