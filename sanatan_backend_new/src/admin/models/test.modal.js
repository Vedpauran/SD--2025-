const mongoose = require('mongoose');
const {Schema} = mongoose;


const TestSchema = new Schema({

    Image:{
        type:Array
    },
    Title:{
        type:String
    },
   
})

const Test = mongoose.model('Test',TestSchema);
module.exports = Test;