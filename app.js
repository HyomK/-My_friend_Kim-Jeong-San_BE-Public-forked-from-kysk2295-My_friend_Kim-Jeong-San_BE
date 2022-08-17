const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const roomRouter = require("./routes/roomRoute");
const paymentRouter = require("./routes/paymentRoute");
const loginRouter = require("./routes/loginRoute");
const registerRouter = require("./routes/registerRoute");
const db = require("./config/db");

const bodyParser = require("body-parser");
const nunjucks = require('nunjucks');
const axios = require('axios');
const qs = require('qs');
const session = require('express-session');

dotenv.config();
const { sequelize } = require("./models");
const { connect } = require("./config/db");

const app = express();
app.set("port", process.env.PORT || 3000);

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결됨.");
    })
    .catch((err) => {
        console.error(err);
    });



nunjucks.configure('views', {
    express: app,
})
app.set('view engine', 'html')

const kakao={
    clientID : '187dfbd8517a2fdb721af0f630552827',
    clientSecret : '08NwRRAOnO5kKs8pCdYsU953VMna3A3T',
    redirectUri: 'http://localhost:3000/auth/kakao/callback'
}

app.get('/', (req,res)=>{
    res.render('index.html');
})

app.use(session({
    secret:'sung',
    resave:true,
    secure:false,
    saveUninitialized:false,
}));

// app.use("/", loginRouter);

app.get('/auth/kakao', (req, res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile_nickname,profile_image,account_email`;
    res.redirect(kakaoAuthURL);
});

app.get('/auth/kakao/callback', async (req, res) => {
    let token;
    try {
        token = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                grant_type: 'authorization_code',
                client_id: kakao.clientID,
                client_secret: kakao.clientSecret,
                redirectUri: kakao.redirectUri,
                code: req.query.code,
            })
        })
    } catch (err) {
        res.json(err.data)
    }

    let user;
    try{
        user = await axios({
            method:"GET",
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization:`Bearer ${token.data.access_token}`
            }
        })
    }catch(err){
        res.json(err.data);
    }
    //console.log(user);

    var psword = user.data.id;
    var id = user.data.properties.nickname;

    const query = "INSERT INTO users(id, psword) VALUES(?, ?);";

    db.query(query, [id, psword], function(err, rows, fields) {
        if(err)
          console.log(err);
        else {
          console.log(rows);
          res.send('회원가입이 완료되었습니다.');
        }
    })



    req.session.kakao = user.data;

    res.redirect('/');

});

app.get('/auth/info',(req,res)=>{
    let {nickname,profile_image} = req.session.kakao.properties
    res.render('info.html',{
        nickname,profile_image
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/register", registerRouter);




app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // json 파싱

app.use("/room", roomRouter);
app.use("/user", userRouter);
app.use("/payment", paymentRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});