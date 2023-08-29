const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
// method-override 라이브러리 사용을 위한 모듈 불러오기
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;
const session_key = process.env.SESSION_KEY;

var db;

// 이 코드를 async/await 과 try - catch 문을 이용하는 방법에 대해서는 좀 더 생각해봐야겠다...
MongoClient.connect(mongo_uri)
  .then((client) => {
    app.listen(port, () => {
      console.log(`listening on ${port}`);
    });

    console.log("Connected to MongoDB");

    db = client.db("todo");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/write-todo", (req, res) => {
  res.render("write.ejs");
});

app.post("/write-todo", async (req, res) => {
  try {
    total = await db
      .collection("post-counter")
      .findOne({ name: "게시물 갯수" });
    await db.collection("post").insertOne({
      _id: total.totalPost + 1,
      todo: req.body.todo,
      date: req.body.date,
      detail: req.body.detail,
      important: req.body.important ? "Y" : "N",
    });
    await db
      .collection("post-counter")
      .updateOne({ name: "게시물 갯수" }, { $inc: { totalPost: 1 } });
  } catch (err) {
    console.error(err);
  }

  console.log("Successfully saved");
  res.status(201).redirect("/list");
});

app.get("/list", async (req, res) => {
  let result;
  try {
    result = await db.collection("post").find().toArray();
    res.status(200).render("list.ejs", { posts: result });
  } catch (err) {
    console.error(err);
  }

  console.log("List successfully loaded");
});

app.get("/post/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const post = await db.collection("post").findOne({ _id: id });

    res.status(200).render("detail.ejs", { post: post });
  } catch (err) {
    console.error(err);
  }

  console.log(`post ${id} successfully loaded`);
});

app.delete("/post/:id", async (req, res) => {
  const id = parseInt(req.body._id);

  try {
    await db.collection("post").deleteOne({ _id: id });
  } catch (err) {
    console.error(err);
    res.status(500);
  }

  console.log("Successfully deleted");
  res.status(200).send({ message: "Successfully deleted" });
});

app.get("/post/:id/edit", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const post = await db.collection("post").findOne({ _id: id });

    res.status(200).render("edit-methodoverride.ejs", { post: post });
  } catch (err) {
    console.error(err);
  }
});

app.put("/post/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.collection("post").updateOne(
      { _id: id },
      {
        $set: {
          todo: req.body.todo,
          date: req.body.date,
          detail: req.body.detail,
          important: req.body.important ? "Y" : "N",
        },
      }
    );
    res
      .status(200)
      // ajax 사용 시 .send({ message: "Successfully updated" })
      // method-override 사용 시
      .redirect(`/post/${id}`);
  } catch (err) {
    console.error(err);
  }
  console.log("Successfully updated");
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: session_key, resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
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
        const result = await db.collection("login").findOne({ id: id });
        if (!result) {
          return done(null, false, { message: "The ID does not exist" });
        }

        if (pw === result.pw) {
          return done(null, result);
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

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (아이디, done) {
  done(null, {});
});
