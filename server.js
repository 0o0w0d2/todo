const express = require("express");
const app = express();
const dotenv = require("dotenv");

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
