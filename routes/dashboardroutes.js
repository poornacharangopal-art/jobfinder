const express = require("express");

const dashboard = require("../controllers/Dashboardcontroller");

const route = express.Router();
const resume=require("../controllers/Resumecontroller");

// Profile

route.get(
    "/profile",
    dashboard.gotoprofile
);


// About

route.get(
    "/profile/about",
    dashboard.gotoAbout
);


// Update About Page

route.get(
    "/profile/about/update",
    dashboard.showUpdateabout
);


// Update About Data
route.get("/resume",resume.openresume);
route.post(
    "/profile/about/update",
    dashboard.update
);
route.get("/ResumeModifier",resume.ResumeModifier);
route.post("/modifier",resume.upload,resume.modifier);
route.post("/resumeupload",resume.upload,resume.resumeupload)
route.get("/resume-rating",dashboard.resumereview);
route.get("/resumerating",resume.ResumeReviewer);
route.post("/reviewer",resume.resumeRating);
module.exports = route;