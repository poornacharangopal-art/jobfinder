const mongoose=require("mongoose");
const Userschema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Gmail:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("Candidate",Userschema);