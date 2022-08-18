const express = require("express");
const { getpage } = require("../controllers/loginController");
const loginController = require("../controllers/loginController");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/kakao", loginController.getKakaoLogin);
router.get("/kakao/callback", loginController.loginProcess);
router.get("/info", loginController.getinfo);
router.get("/", loginController.getpage);

module.exports = router;
