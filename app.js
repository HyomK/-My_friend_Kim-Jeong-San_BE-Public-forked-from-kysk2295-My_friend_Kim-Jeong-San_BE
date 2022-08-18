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
const nunjucks = require("nunjucks");
const axios = require("axios");
const qs = require("qs");
const session = require("express-session");

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

nunjucks.configure("views", {
    express: app,
});
app.set("view engine", "html");

const kakao = {
    clientID: "187dfbd8517a2fdb721af0f630552827",
    clientSecret: "08NwRRAOnO5kKs8pCdYsU953VMna3A3T",
    redirectUri: "http://localhost:3000/auth/kakao/callback",
};

app.get("/", (req, res) => {
    res.render("index.html");
});

app.use(
    session({
        secret: "sung",
        resave: true,
        secure: false,
        saveUninitialized: false,
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/register", registerRouter);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // json 파싱

app.use("/auth", loginRouter);
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
