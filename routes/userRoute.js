const express = require("express");
const userController = require("../controllers/userController");
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const friendController = require("../controllers/friendController");
const router = express.Router();
// const { sequelize, User, Room } = require("../models/index");

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/:userId/register", registerController.getAccount);

router.get("/:userId/register", registerController.getProfile);

router.post("/login", loginController.getKakaoUser);

router.get("/:userId/friend", friendController.getFriendInfo);

module.exports = router;
