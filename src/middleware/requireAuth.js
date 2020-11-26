const mongoose = require("mongoose");
const User = mongoose.model("User");
const tokenService = require("../services/token");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "not logged in" });
  }

  const token = authorization.replace("Bearer ", "");
    tokenService.verify(token).then((t) => {
      if (t.status == "success") {
        const { userId } = t.data;
        const user = User.findById(userId);
        req.user = user;
        next();
      }else if (t.statis == "fail") {
        res.status(422).send(t);
      }
      next();
      
    });
};
