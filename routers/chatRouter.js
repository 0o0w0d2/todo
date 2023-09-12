const chatRouter = require("express").Router();
const { ObjectId } = require("mongodb");
const { getDb } = require("../db");

// const db = getDb();

chatRouter.get("/", async (req, res) => {
  try {
    const db = getDb();
    const id = req.user.result._id;
    const rooms = await db
      .collection("chatroom")
      .find({ member: id })
      .toArray();
    console.log(rooms);
    res.render("chat.ejs", { rooms: rooms });
  } catch (err) {
    console.error(err);
  }
});

// 이 유저와 채팅하기 버튼을 누르면
// 채팅창으로 이동시킴
// 채팅창의 왼쪽에는 현재 접속한 유저가 참여하고 있는 채팅창들을 보여줌(nav처럼)
// 채팅창의 오른쪽에는 현재 들어간 채팅방의 내용을 보여줌

chatRouter.post("/", async (req, res) => {
  try {
    const db = getDb();
    const senderId = req.user.result._id;
    const data = {
      member: [senderId, new ObjectId(req.body.user)],
      date: new Date(),
      title: "ㅎㅇㅎㅇ",
    };
    await db.collection("chatroom").insertOne(data);
  } catch (err) {
    console.error(err);
  }
});

chatRouter.post("/message", async (req, res) => {
  try {
    const db = getDb();

    const message = {
      sender: req.user.result._id,
      content: req.body.content,
      roomId: req.body.parent,
      date: new Date(),
    };

    console.log("보낸 메시지", message);

    await db.collection("message").insertOne(message);
  } catch (err) {
    console.error(err);
  }
});

chatRouter.get("/message/:roomId", async (req, res) => {
  try {
    const db = getDb();
    const roomId = req.params.roomId;
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });

    console.log("이거", roomId);

    const chatting = await db
      .collection("message")
      .find({ roomId: roomId })
      .toArray();

    res.write("event: test\n");
    res.write(`data: ${JSON.stringify(chatting)}\n\n`);

    const pipeline = [{ $match: { "fullDocument.roomId": roomId } }];

    const collection = db.collection("message");
    const changeStream = collection.watch(pipeline);
    changeStream.on("change", (result) => {
      console.log(result.fullDocument);
      res.write("event: test\n");
      res.write(`data: ${JSON.stringify([result.fullDocument])}\n\n`);
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = chatRouter;
