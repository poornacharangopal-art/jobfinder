const axios = require("axios");
const cheerio = require("cheerio");

exports.searchJobs = async (skill) => {

    try {

        const url =
            `https://example-job-site.com/jobs?q=${encodeURIComponent(skill)}`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        const jobs = [];

        $(".job-card").each((index, element) => {

            const title = $(element)
                .find(".job-title")
                .text()
                .trim();

            const company = $(element)
                .find(".company")
                .text()
                .trim();

            const location = $(element)
                .find(".location")
                .text()
                .trim();

            const relativeUrl = $(element)
                .find("a")
                .attr("href");

            const jobUrl = relativeUrl
                ? new URL(relativeUrl, url).href
                : "";

            if (title) {

                jobs.push({

                    title: title,

                    company: company || "Unknown company",

                    location:
                        location || "Location not specified",

                    jobUrl: jobUrl,

                    applyUrl: jobUrl,

                    skill: skill

                });

            }

        });

        return jobs;

    } catch (error) {

        console.log(
            "Job scraping error:",
            error.message
        );

        return [];

    }

};