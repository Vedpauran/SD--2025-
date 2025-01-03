const express =require('express');
const router = express.Router();
const Scriptures = require('../../models/pages/scriptures');
const moment = require('moment');


router.get('/',async (req,res)=> {
    try{
        const scriptures = await Scriptures.find();
        res.status(201).json(scriptures);
    }catch(error){
        res.status(500).json({message:error.message})
    }
});


router.post("/add",async (req,res)=>{
    try {
         const Addscripture = Scriptures.create(req.body).then((result)=>{
            res.status(200).json(result)}).catch((e)=>{
            res.status(500).json({message:error.message});
        })
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})


router.get('/:id',async(req,res)=> {
    try{
        const scripture = await Scriptures.findById(req.params.id);
        if(scripture !==''){
            res.scripture = scripture;
            res.json(res.scripture);
        }else{
        return res.status(404).json({message:"Not Found"})
    }
    }catch(error){
        return res.status(500).json({message:error.message})
    }

});


router.put("/:id",async(req,res)=>{
    const _id =req.params.id;
  try {
    const UpdateScripture =  await Scriptures.findByIdAndUpdate(_id,req.body);
      res.status(200).json({msg:"Successfully Updated"});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
})


router.delete("/:id",async(req,res)=>{
    const _id = req.params.id;
   try {
     const ScriptureDelete = await Scriptures.deleteOne({_id});
     res.status(200).json({msg:"Successfully Deleted"});
   } catch (error) {
    res.status(500).json({message:error.message});
   }
})


module.exports = router;