const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;

MongoClient.connect(mongo_uri)
  .then((client) => {
    console.log("Connected to MongoDB");

    const db = client.db("todo");

    db.collection("post").insertOne({
      todo: "안녕",
      date: "2020-03-02",
    });

    app.listen(port, () => {
      console.log(`listening on ${port}`);
    });
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

app.post("/write-todo", (req, res) => {
  console.log("작성 완료!");
  console.log(req.body.todo);
  console.log(req.body.date);
  if (!req.body.important) {
    console.log("중요하지 않음!");
  } else {
    console.log("중요!");
  }
  // 작성된 이후에 할 일 목록창으로 연결시켜주기?
  // res.sendFile(__dirname + '/list.html')
});
