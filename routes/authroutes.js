const express = require("express");

const auth = require("../controllers/authcontroller");

const route = express.Router();

route.get("/login", auth.loginPage);

route.post("/loginuser", auth.login);
route.get("/signup", auth.signuppage);
route.post("/signupuser", auth.signup);
route.get("/logout", auth.logout);

module.exports = route;