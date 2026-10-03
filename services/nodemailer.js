const nodemailer=require("nodemailer");
const createtansport=async()=>{
    const transport=await nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:process.env.Email,
            pass:process.env.Password
        }
});
    return transport;
}
module.exports=createtansport;
