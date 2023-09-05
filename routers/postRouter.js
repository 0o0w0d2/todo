const postRouter = require("express").Router();
const methodOverride = require("method-override");
postRouter.use(methodOverride("_method"));
const { connectToDatabase, getDb } = require("../db");
postRouter.get("/write-todo", (req, res) => {
  res.render("write.ejs");
});

postRouter.post("/write-todo", async (req, res) => {
  try {
    const db = getDb();
    const total = await db
      .collection("post-counter")
      .findOne({ name: "게시물 갯수" });
    const post = {
      _id: total.totalPost + 1,
      todo: req.body.todo,
      date: req.body.date,
      detail: req.body.detail,
      important: req.body.important ? "Y" : "N",
      user: req.user.result._id,
    };
    await db.collection("post").insertOne(post);
    await db
      .collection("post-counter")
      .updateOne({ name: "게시물 갯수" }, { $inc: { totalPost: 1 } });
  } catch (err) {
    console.error(err);
  }

  console.log("Successfully saved");
  res.status(201).redirect("/list");
});

postRouter.get("/list", async (req, res) => {
  let result;
  try {
    const db = getDb();
    result = await db.collection("post").find().toArray();
    res.status(200).render("list.ejs", { posts: result });
  } catch (err) {
    console.error(err);
  }

  console.log("List successfully loaded");
});

postRouter.get("/post/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const db = getDb();
    const post = await db.collection("post").findOne({ _id: postId });

    res.status(200).render("detail.ejs", { post: post });
  } catch (err) {
    console.error(err);
  }

  console.log(`post ${postId} successfully loaded`);
});

postRouter.delete("/post/:postId", async (req, res) => {
  const postId = parseInt(req.body._id);
  const currentUser = req.user.result._id;

  try {
    const db = getDb();
    const post = await db.collection("post").findOne({ _id: postId });

    if (!currentUser.equals(post.user)) {
      res.status(400).send("삭제 권한이 없습니다.");
      return;
    }

    await db.collection("post").deleteOne({ _id: postId });
  } catch (err) {
    console.error(err);
    res.status(500);
  }

  console.log("Successfully deleted");
  res.status(200).send({ message: "Successfully deleted" });
});

postRouter.get("/post/:postId/edit", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const currentUser = req.user.result._id;

  try {
    const db = getDb();
    const post = await db.collection("post").findOne({ _id: postId });

    if (!currentUser.equals(post.user)) {
      res.status(400).send("수정 권한이 없습니다.");
      return;
    }

    res.status(200).render("edit-methodoverride.ejs", { post: post });
  } catch (err) {
    console.error(err);
  }
});

postRouter.put("/post/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const currentUser = req.user.result._id;

  try {
    const db = getDb();
    const post = await db.collection("post").findOne({ _id: postId });

    if (!currentUser.equals(post.user)) {
      res.status(400).send("수정 권한이 없습니다.");
      return;
    }

    await db.collection("post").updateOne(
      { _id: postId },
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
      .redirect(`/post/${postId}`);
  } catch (err) {
    console.error(err);
  }
  console.log("Successfully updated");
});

module.exports = postRouter;
