const express = require("express");
const middleware = require("./../middleware/middleware");

const register = require("./../functions/users/register");
const signin = require("./../functions/users/signin");
const getUsers = require("./../functions/users/getUsers");
const deleteUser = require("./../functions/users/deleteUser");

const router = express.Router();

router.get("/getusers/:key", getUsers);

router.post("/register", register);

router.post("/signin", signin);

router.use(middleware);

router.delete("/deleteuser/", deleteUser);

module.exports = router;
