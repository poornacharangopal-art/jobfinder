const express = require("express");

const job =
    require("../controllers/Jobcontroller");

const route = express.Router();


route.get(
    "/jobs",
    job.jobSearch
);


module.exports = route;