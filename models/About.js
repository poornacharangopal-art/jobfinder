const mongoose=require("mongoose");
const AboutSchema=new mongoose.Schema({
    CandidateId:{
           type: mongoose.Schema.Types.ObjectId,
             ref: "Candidate",
        required: true
    },
    Name:{
        type:String,
        required:true
    },
    College:{
        type:String
    },
    PassoutYear:{
        type:Number
    },
    Skills:[{
        type:String
}],
    Location:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("About",AboutSchema);