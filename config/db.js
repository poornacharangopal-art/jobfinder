const mongoose=reqiuire("mongoose");
let isconnected=false;
const connectDB=async()=>{
    if(isconnected){
        return;
    }
    try{
        await mongoose.connect(process.env.MONGO_URI);
        isconnected=true;
        console.log("connected to database");
    }catch(err){
    console.error("error in connecting database!");
    }
}
module.exports=connectDB;