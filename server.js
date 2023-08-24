const express = require("express");
const app = express();
const dotenv = require("dotenv");

app.use(express.urlencoded({ extended: true }));

dotenv.config();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}!`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/write", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});

app.post("/add", (req, res) => {
  res.send("전송 완료!");
  console.log(req.body.todo);
  console.log(req.body.date);
  if (!req.body.important) {
    console.log("중요하지 않음!");
  } else {
    console.log("중요!");
  }
});
