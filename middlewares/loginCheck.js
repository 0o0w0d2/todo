function loginCheck(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send({ message: "로그인한 사용자만 이용할 수 있습니다" });
  }
}

module.exports = loginCheck;
