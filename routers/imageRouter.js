const imageRouter = require("express").Router();
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/image");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    // 확장자가 png, jpg, jpeg가 아니면 업로드 X (이미지)
    if (ext !== ".png" && ext !== ".jpg" && ext !== "jpeg") {
      return callback(new Error("PNG, JPG만 업로드하세요"));
    }
    callback(null, true);
  },
  // 파일 사이즈 제한
  limits: {
    fileSize: 1024 * 1024,
  },
});

imageRouter.get("/upload", (req, res) => {
  res.render("upload.ejs");
});

// 사진을 여러 개 업로드하고 싶을 경우 upload.array('input name', 받을 최대 갯수)
imageRouter.post("/upload", upload.single("profile"), (req, res) => {
  res.send("이미지 업로드 완료");
});

module.exports = imageRouter;
