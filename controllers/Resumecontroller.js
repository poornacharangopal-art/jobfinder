const Resume=require("../models/Resume");
const Candidate=require("../models/Candidate");
const createtansport=require("../services/nodemailer");
const createai=require("../services/gemini");
const Ai=createai();
const fs=require("fs");
const path=require("path");
const multer=require("multer");
const { chromium } = require("playwright");
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads");
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname);
    }
});
const upload=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(file.mimetype=="application/pdf"){
            return cb(null,true);
        }
        return cb(null,false);
    }
});
exports.ResumeModifier=async(req,res)=>{
    if(!req.session.candidateId){
        return res.send("Please login first");
    }
    else{
        let candidate=await Candidate.findById(req.session.candidateId);
        if(!candidate){
            return res.send("no user with credentials found");
        }
        return res.render("ResumeModifier",{
            candidate
        });
    }
}
exports.upload = upload.single("resume");
/*exports.modifier=async(req,res)=>{
      if(!req.session.candidateId){
        return res.send("Please login first");
    }
     let candidate=await Candidate.findById(req.session.candidateId);
        if(!candidate){
            return res.send("no user with credentials found");
        }
         const geminifile = await Ai.files.upload({
            file: req.file.path,

            config: {
                mimeType: "application/pdf"
            }
        });

        const response=await Ai.models.generateContent({
            model:"gemini-3.5-flash",
            contents:[
                {
                 role: "user",
                 parts:[
                {
                fileData:{
                    fileUri:geminifile.uri,
                    mimeType:geminifile.mimeType
                }
            },
            {
                   text: `
Analyze this resume and improve it professionally.

Improve:
- Resume wording
- Grammar
- Professional summary
- Skills presentation
- Project descriptions
- Experience descriptions
- ATS friendliness
- Formatting structure

Do NOT invent fake experience, projects, skills or achievements.

Return ONLY complete HTML for the modified resume.

Use clean professional HTML.
Do not use markdown.
Do not write explanations.
`
            }
            ]
        }
            ]
        });
          const html = response.text;


        if (!html) {
            return res.send("Gemini did not return resume content");
        }
        const browser = await chromium.launch();

const page = await browser.newPage();

await page.setContent(html);

const outputName =
    "modified-resume-" +
    req.session.candidateId +
    "-" +
    Date.now() +
    ".pdf";

const outputPath = path.join(
    __dirname,
    "../public/resumes",
    outputName
);

await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm"
    }
});

await browser.close();
    }*/
exports.modifier = async(req,res) => {

    console.log("1. MODIFIER STARTED");

    if(!req.session.candidateId) {
        return res.send("Please login first");
    }

    console.log("2. SESSION OK");

    let candidate = await Candidate.findById(
        req.session.candidateId
    );

    if(!candidate) {
        return res.send("no user with credentials found");
    }

    console.log("3. CANDIDATE FOUND");

    if(!req.file) {
        return res.send("Please upload a PDF resume");
    }

    console.log("4. FILE RECEIVED");
    console.log(req.file.path);


    console.log("5. UPLOADING FILE TO GEMINI");

    const geminifile = await Ai.files.upload({

        file: req.file.path,

        config: {
            mimeType: "application/pdf"
        }

    });

    console.log("6. FILE UPLOADED TO GEMINI");
    console.log(geminifile.uri);


    console.log("7. SENDING TO GEMINI");

    const response = await Ai.models.generateContent({

        model: "gemini-3.5-flash",

        contents: [

            {
                role: "user",

                parts: [

                    {
                        fileData: {
                            fileUri: geminifile.uri,
                            mimeType: geminifile.mimeType
                        }
                    },

                    {
                        text: `
Analyze this resume and improve it professionally.

Improve:
- Resume wording
- Grammar
- Professional summary
- Skills presentation
- Project descriptions
- Experience descriptions
- ATS friendliness
- Formatting structure

Do NOT invent fake experience, projects, skills or achievements.

Return ONLY complete HTML for the modified resume.

Use clean professional HTML.
Do not use markdown.
Do not write explanations.
`
                    }

                ]

            }

        ]

    });


    console.log("8. GEMINI RESPONSE RECEIVED");


    const html = response.text;

    if(!html) {
        return res.send("Gemini did not return resume content");
    }

    console.log("9. HTML RECEIVED");


    console.log("10. STARTING PLAYWRIGHT");

    const browser = await chromium.launch();

    console.log("11. BROWSER STARTED");

    const page = await browser.newPage();

    console.log("12. PAGE CREATED");

    await page.setContent(html);

    console.log("13. HTML SET");


    const outputName =
        "modified-resume-" +
        req.session.candidateId +
        "-" +
        Date.now() +
        ".pdf";


    const outputPath = path.join(
        __dirname,
        "../public/resumes",
        outputName
    );


    console.log("14. CREATING PDF");

    await page.pdf({

        path: outputPath,

        format: "A4",

        printBackground: true,

        margin: {
            top: "15mm",
            bottom: "15mm",
            left: "15mm",
            right: "15mm"
        }

    });


    console.log("15. PDF CREATED");


    await browser.close();

    console.log("16. BROWSER CLOSED");


    const downloadUrl = "/resumes/" + outputName;


    return res.render("ResumeModified", {

        candidate: candidate,

        downloadUrl: downloadUrl

    });

};
exports.openresume=async(req,res)=>{
    const candidateId=req.session.candidateId;
    if(!candidateId){
                return res.send("user not found");
    }
    const candidate=await Candidate.findById(candidateId);
    if(!candidate){      
                return res.send("user not found");
    }
       let resu=await Resume.findOne({
        UserId:candidateId
    });
    return res.render("Resume", {
    user: candidate,
    resume: resu,
    uploaded: !!resu
});
}
exports.resumeupload=async(req,res)=>{
    const resume=req.file.path;
    const candidateId=req.session.candidateId;
    if(!candidateId){
        return res.send("user not found");
    }
    const candidate=await Candidate.findById(candidateId);
    let resu=await Resume.findOne({
        UserId:candidateId
    });
    if(!resu){
        resu=new Resume({
            UserId:candidateId,
            Resumefile:resume
        });
    }
    else{
        resu.Resumefile=resume.path;
    }
    await resu.save();
    return res.render("Resume", {
    user: candidate,
    resume: resu,
    uploaded: !!resu
});
}
exports.resumeRating = async(req,res) => {

    if(!req.session.candidateId){
        return res.redirect("/login");
    }

    const candidate = await Candidate.findById(
        req.session.candidateId
    );

    if(!candidate){
        return res.redirect("/login");
    }

    const resume = await Resume.findOne({
        UserId: req.session.candidateId
    });

    if(!resume){
        return res.send("Please upload your resume first");
    }

    try{

        console.log("Uploading resume to Gemini...");

        const geminifile = await Ai.files.upload({
            file: resume.Resumefile,
            config:{
                mimeType:"application/pdf"
            }
        });

        console.log("Resume uploaded");

        const response = await Ai.models.generateContent({

            model:"gemini-3.5-flash",

            contents:[{

                role:"user",

                parts:[

                    {
                        fileData:{
                            fileUri:geminifile.uri,
                            mimeType:geminifile.mimeType
                        }
                    },

                    {
                        text:`

You are an expert resume reviewer and ATS specialist.

Analyze the uploaded resume carefully.

Evaluate the resume based ONLY on the information present
in the resume.

DO NOT invent:
- skills
- experience
- projects
- achievements
- education
- certifications

Give scores from 0 to 100 for:

1. Overall resume quality
2. ATS compatibility
3. Skills
4. Experience
5. Projects
6. Education
7. Professional summary
8. Formatting

Also identify:

- Strong points in the resume
- Weak points
- Missing or weak keywords
- Specific improvements
- A final recommendation

Return ONLY valid JSON.

Use exactly this structure:

{
    "overallScore": 0,
    "atsScore": 0,
    "skillsScore": 0,
    "experienceScore": 0,
    "projectsScore": 0,
    "educationScore": 0,
    "summaryScore": 0,
    "formattingScore": 0,

    "summary": "",

    "strengths": [
        "",
        "",
        ""
    ],

    "weaknesses": [
        "",
        "",
        ""
    ],

    "keywords": [
        "",
        "",
        ""
    ],

    "improvements": [
        "",
        "",
        ""
    ],

    "recommendation": ""
}

`
                    }

                ]

            }]

        });

        let result = response.text;

        console.log("Gemini response received");

        // Remove markdown JSON fences if Gemini adds them
        result = result
            .replace(/```json/g,"")
            .replace(/```/g,"")
            .trim();

        const analysis = JSON.parse(result);

        console.log(analysis);

        return res.render("ResumeRatingResult",{

            user:candidate,

            resume:resume,

            analysis:analysis

        });

    }
    catch(error){

        console.log("Resume rating error:",error);

        return res.send(
            "Unable to analyze resume right now"
        );

    }

};
exports.ResumeReviewer=async(req,res)=>{
    if(!req.session.candidateId){
        return res.send("Please login first");
    }
    else{
        let candidate=await Candidate.findById(req.session.candidateId);
        if(!candidate){
            return res.send("no user with credentials found");
        }
        return res.render("Resumereviewer",{
            candidate
        });
    }
}
