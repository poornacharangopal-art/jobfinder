const Candidate=require("../models/Candidate");
const About=require("../models/About");
const Resume=require("../models/Resume");
const createai=require("../services/gemini");
const Ai=createai();
const multer=require("multer");
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
     filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }    
    });
const upload=multer({
    storage:storage,
     fileFilter:function(req,file,cb){
        if(file.mimetype=="application/pdf"){
            cb(null,true);
        }
        else{
            cb(null,false);
        }
    }
});
exports.gotoprofile=async(req,res)=>{
    const userid=req.session.candidateId;
    const candidate=await Candidate.findById(userid);
    if(!candidate){
        return res.send("no candidate found");
    }
    return res.render("Profile",{
        user:candidate
    });
}
exports.gotoAbout=async(req,res)=>{
    const userid=req.session.candidateId;
     const candidate = await Candidate.findById(userid);
    const about=await About.findOne({
        CandidateId:userid
    });
    if(!candidate){
    return res.redirect("/login");
}
    if(!about){
        return res.render("About",{
        user:candidate
    });
    }
    return res.render("About1",{
        user:about
    });
}
exports.showUpdateabout=async(req,res)=>{
     const userid=req.session.candidateId;
       const user=await About.findOne({
        CandidateId:userid
    });
    if(!user){
        return res.redirect("/profile/about");
    }
    return res.render("Updateabout",{
        user
    });
}
exports.update=async(req,res)=>
{
    const {Name,College,PassoutYear,Skills,Location}=req.body;
    const Id=req.session.candidateId;
     let user=await About.findOne({
        CandidateId:Id
    });
    if(!user){
            user=new About({
            CandidateId:Id,
            Name:Name,
            College:College,
            PassoutYear:PassoutYear,
            Skills:Skills,
            Location:Location
        });
    }
    else{
            user.Name = Name;
            user.College = College;
            user.PassoutYear = PassoutYear;
            user.Skills = Skills;
            user.Location = Location;
    }
    await  user.save();
        return res.render("About1",{
            user
        });

}
exports.resumereview=async(req,res)=>{
      const Id=req.session.candidateId;
     let user=await About.findOne({
        CandidateId:Id
    });
    if(!user){
        return res.redirect("/login")
    }
    return res.render("resumerating",{
        user:user
    });
}
exports.jobSearch = async (req, res) => {

    const candidateId = req.session.candidateId;

    if (!candidateId) {
        return res.redirect("/login");
    }

    const about = await About.findOne({
        CandidateId: candidateId
    });

    if (!about) {
        return res.redirect("/profile/about");
    }

    const skills = about.Skills;

    let jobs = [];

    for (const skill of skills) {

        // Get jobs from your authorized job API
        const skillJobs = await getJobsForSkill(skill);

        skillJobs.forEach(job => {

            jobs.push({
                title: job.title,
                company: job.company,
                location: job.location,
                jobUrl: job.jobUrl,
                applyUrl: job.applyUrl,
                source: job.source,
                skill: skill
            });

        });
    }

    // Remove duplicate jobs
    const uniqueJobs = [];

    const seen = new Set();

    for (const job of jobs) {

        if (seen.has(job.jobUrl)) {
            continue;
        }

        seen.add(job.jobUrl);
        uniqueJobs.push(job);
    }

    return res.render("JobSearch", {
        user: await Candidate.findById(candidateId),
        jobs: uniqueJobs
    });
};