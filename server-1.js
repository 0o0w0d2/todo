const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
// method-override 라이브러리 사용을 위한 모듈 불러오기
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const { connectToDatabase } = require("./db");
const loginCheck = require("./middlewares/loginCheck.js");

const port = process.env.PORT;

connectToDatabase();

app.listen(port, () => {
  console.log(`listening on ${port}`);
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use("/", require("./routers/userRouter.js"));
app.use("/post", loginCheck, require("./routers/postRouter.js"));
app.use("/image", require("./routers/imageRouter.js"));
