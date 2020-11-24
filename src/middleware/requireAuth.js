const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const config = require("../config/CONSTANTS.json");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "not logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, config.MY_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "you must be logged in" });
    }

    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;

    console.log("ERR: ", err);
    console.log("payload: ", payload);

    next();
  });
};
