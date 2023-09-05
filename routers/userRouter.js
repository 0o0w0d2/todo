const userRouter = require("express").Router();
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { getDb } = require("../db");
const loginCheck = require("../middlewares/loginCheck.js");
const session_key = process.env.SESSION_KEY;

userRouter.use(
  session({ secret: session_key, resave: true, saveUninitialized: false })
);
userRouter.use(passport.initialize());
userRouter.use(passport.session());

userRouter.get("/login", (req, res) => {
  res.render("login.ejs");
});

userRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    async function (id, pw, done) {
      try {
        const db = getDb();
        const result = await db.collection("member").findOne({ id: id });
        if (!result) {
          return done(null, false, { message: "The ID does not exist" });
        }

        if (pw === result.pw) {
          return done(null, result);
          // 여기의 result가 serializeUser의 user로 들어 감
        } else {
          return done(null, false, { message: "Password does not match" });
        }
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

// id를 이용해서 세션을 저장시키는 코드 (로그인 성공 시 발동)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// 이 세션 데이터를 가진 사람을 DB에서 찾아주세요 (마이페이지 접속 시 발동)
passport.deserializeUser(async function (id, done) {
  try {
    const db = getDb();
    const result = await db.collection("member").findOne({ id: id });

    done(null, { result });
  } catch (err) {
    console.error(err);
  }
});

userRouter.get("/register", (req, res) => {
  res.render("register.ejs");
});

userRouter.post("/register", async (req, res) => {
  // 아이디 중복 체크?
  // 비밀번호 == 비밀번호 확인?
  // 비밀번호 암호화해서 DB에 저장
  const id = req.body.id;
  const pw = req.body.pw;

  // id에 알파벳, 숫자만 들어있나 확인(정규식)
  // id, pw 자릿 수 제한
  try {
    const db = getDb();
    const idCheck = await db.collection("member").findOne({ id: id });

    if (idCheck) {
      res.status(400).send("이미 존재하는 아이디입니다.");
      return;
    }
    await db.collection("member").insertOne({
      id: id,
      pw: pw,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }

  res.redirect("/");
});

userRouter.get("/mypage", loginCheck, async (req, res) => {
  const id = req.user.result._id;

  try {
    const db = getDb();
    const myPosts = await db.collection("post").find({ user: id }).toArray();
    res.render("mypage.ejs", { posts: myPosts });
  } catch (err) {
    console.error(err);
  }
});

module.exports = userRouter;
