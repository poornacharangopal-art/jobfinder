const Candidate = require("../models/Candidate");
const About = require("../models/About");
const jobService = require("../services/jobService");

exports.jobSearch = async (req, res) => {

    try {

        const candidateId =
            req.session.candidateId;

        if (!candidateId) {
            return res.redirect("/login");
        }

        const candidate =
            await Candidate.findById(candidateId);

        if (!candidate) {
            return res.redirect("/login");
        }

        const about =
            await About.findOne({
                CandidateId: candidateId
            });

        if (!about) {
            return res.redirect("/profile/about");
        }

        const skills = about.Skills || [];

        let jobs = [];

        for (const skill of skills) {

            const skillJobs =
                await jobService.searchJobs(skill);

            jobs.push(...skillJobs);

        }

        // Remove duplicate jobs

        const uniqueJobs = [];

        const seen = new Set();

        for (const job of jobs) {

            const id =
                job.jobUrl ||
                `${job.title}-${job.company}`;

            if (seen.has(id)) {
                continue;
            }

            seen.add(id);

            uniqueJobs.push(job);
        }

        res.render("JobSearch", {

            user: candidate,

            jobs: uniqueJobs

        });

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to search jobs"
        );

    }

};