const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const jobRoutes = require("./routes/jobroutes");
require("dotenv").config();
const app = express();
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static(
    path.join(__dirname, "public")
));
app.use(express.static(
    path.join(__dirname, "uploads")
));
app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false
    })
);
app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);
mongoose.connect(process.env.MONGO_URI)

    .then(() => {

        console.log("MongoDB connected");

    })
    .catch((error) => {

        console.log("MongoDB connection error");

    });
const authRoutes = require("./routes/authroutes");
const dashboardRoutes = require("./routes/dashboardroutes");
app.use("/", jobRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.get("/test", (req, res) => {
    res.render("login");
});
app.get("/", (req, res) => {

    res.render("Home");

});
app.get("/dashboard", async (req, res) => {

    const candidateId = req.session.candidateId;

    if (!candidateId) {
        return res.redirect("/login");
    }

    const Candidate = require("./models/Candidate");

    const candidate = await Candidate.findById(candidateId);

    console.log("CANDIDATE:", candidate);
    console.log("NAME:", candidate?.Name);

    if (!candidate) {
        return res.redirect("/login");
    }

    res.render("Dashboard", {
        user: candidate
    });
});
app.use((req, res) => {

    res.status(404).send("Page not found");

});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});