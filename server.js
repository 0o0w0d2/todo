const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;

var db;

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
  res.sendFile(__dirname + "/index.html");
});

app.get("/write-todo", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});

// insertOne의 callback을 이용하면 console message가 제대로 출력되지 않는 현상으로 인해 try-catch문으로 바꿈
// insertOne의 callback이 제대로 작동하지 않는 이유에 대해서 계속 알아봐야 할 듯
app.post("/write-todo", (req, res) => {
  try {
    db.collection("post").insertOne({
      todo: req.body.todo,
      date: req.body.date,
      important: req.body.important ? "Y" : "N",
    });

    console.log("저장 완료!");
  } catch (err) {
    console.error("에러 발생:", err);
  }

  res.redirect("/");
});
