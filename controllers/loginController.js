const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const axios = require("axios");
const qs = require("qs");
const session = require("express-session");
const db = require("../config/db");

module.exports = {
    getKakaoLogin: (req, res) => {
        const kakao = {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: process.env.REDIRECT_URI,
        };
        const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile_nickname,profile_image,account_email`;
        res.redirect(kakaoAuthURL);
    },
    loginProcess: async (req, res) => {
        const kakao = {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: process.env.REDIRECT_URI,
        };
        let token;
        try {
            token = await axios({
                method: "POST",
                url: "https://kauth.kakao.com/oauth/token",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                data: qs.stringify({
                    grant_type: "authorization_code",
                    client_id: kakao.clientID,
                    client_secret: kakao.clientSecret,
                    redirectUri: kakao.redirectUri,
                    code: req.query.code,
                }),
            });
        } catch (err) {
            res.json(err.data);
        }

        let user;
        try {
            user = await axios({
                method: "GET",
                url: "https://kapi.kakao.com/v2/user/me",
                headers: {
                    Authorization: `Bearer ${token.data.access_token}`,
                },
            });
        } catch (err) {
            res.json(err.data);
        }
        console.log(user);

        var id = user.data.id;
        var user_name = user.data.properties.profile_nickname;
        const psword = "noPasswordHere";
        const query = "INSERT INTO users(id, psword) VALUES(?, ?);";

        db.query(query, [id, psword], function (err, rows, fields) {
            if (err) console.log(err);
            else {
                console.log(rows);
                res.send("회원가입이 완료되었습니다.");
            }
        });

        req.session.kakao = user.data;

        res.redirect("/");
    },
    getinfo: (req, res) => {
        let { nickname, profile_image } = req.session.kakao.properties;
        res.render("info.html", {
            nickname,
            profile_image,
        });
    },
    getpage: (req, res) => {
        res.render("index.html");
    },
};
