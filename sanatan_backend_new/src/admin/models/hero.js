
const mongoose = require('mongoose');
const {Schema} = mongoose;


const HeroSchema = new Schema({


    
    Name:{
        type:String
    },
    Link:{
        type:String
    },
    Image:{
        type:String
    },
    Publish:{
        type:Date
    }
    


})

const Hero = mongoose.model('Hero',HeroSchema);
module.exports = Hero;