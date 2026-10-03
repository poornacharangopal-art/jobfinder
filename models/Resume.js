const mongoose=require("mongoose");
const Resumeschema=new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true

    },
    Resumefile:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("Resume",Resumeschema);

