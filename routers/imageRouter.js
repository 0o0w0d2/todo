const imageRouter = require("express").Router();
const { getDb } = require("../db");

imageRouter.get("/upload", (req, res) => {
  res.render("upload.ejs");
});

module.exports = imageRouter;
