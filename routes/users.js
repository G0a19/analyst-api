const express = require("express");

const register = require("./../functions/users/register");
const signin = require("./../functions/users/signin");
const getUsers = require("./../functions/users/getUsers");

const router = express.Router();

router.get("/getusers/:key", getUsers);

router.post("/register", register);

router.post("/signin", signin);

module.exports = router;
