const express = require("express");
const loginController = require('../controllers/loginController');
const { User } = require("../models");
const router = express.Router();


router.get("/", function(req, res){
    res.render('register');
});



module.exports = router;