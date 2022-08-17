const express = require('express');
const { getpage } = require('../controllers/loginController');
const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController');
const router = express.Router();

router.get("/auth/kakao", loginController.getKakaoLogin);
router.get("/auth/kakao/callback", loginController.loginProcess);
router.get("/auth/info", loginController.getinfo);
router.get("/", loginController.getpage);




module.exports = router;