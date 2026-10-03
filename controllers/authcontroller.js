const Candidate=require("../models/Candidate");
const About=require("../models/About");
const Resume=require("../models/Resume");
/*exports.loginPage=async(req,res)=>{
    res.render("login");
    */
   exports.signuppage = async(req,res) => {

    console.log("SIGNUP PAGE ROUTE HIT");

    res.render("signup");

}
exports.signup=async(req,res)=>{
    const{Name,Gmail,Password}=req.body;
    let candidate=await Candidate.findOne({
        Gmail:Gmail
    });
    if(candidate){
        return res.send("email already exists");
    }
    candidate=new Candidate({
        Name:Name,
        Gmail:Gmail,
        Password:Password
    });
    await candidate.save();
    req.session.candidateId=candidate._id;
    return res.render("Dashboard",{
        user:candidate
    });
}
exports.loginPage=async(req,res)=>{
    res.render("login");
}
exports.login=async(req,res)=>{
    const{Gmail,Password}=req.body;
    const candidate=await Candidate.findOne({
        Gmail:Gmail,
        Password:Password
    });
    if(!candidate){
        return res.send("Invalid credentials");
    }
    if(Password!==candidate.Password){
        return res.send("Invalid credentials");
    }
    req.session.candidateId=candidate._id;
    return res.render("Dashboard",{
        user:candidate
    });
}   
exports.logout=async(req,res)=>{
req.session.destroy((err) => {

        if (err) {
            return res.status(500).send("Unable to logout");
        }
        res.redirect("/login");
    });
}