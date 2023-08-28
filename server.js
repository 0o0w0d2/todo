const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));

const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;

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
  res.status(201);
  res.redirect("/list");
});

app.get("/list", async (req, res) => {
  let result;
  try {
    result = await db.collection("post").find().toArray();
    res.render("list.ejs", { posts: result });
  } catch (err) {
    console.error(err);
  }

  console.log("List successfully loaded");
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

app.get("/post/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const post = await db.collection("post").findOne({ _id: id });
    res.render("detail.ejs", { post: post });
  } catch (err) {
    console.error(err);
  }

  console.log(`post ${id} successfully loaded`);
});
