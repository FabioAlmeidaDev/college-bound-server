const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

// Secret SALT
const config = require("../config/CONSTANTS.json");

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email) {
        return res.status(422).send({ error: "Must provide an email" });
      }
      if (!password) {
        return res.status(422).send({ error: "Must provide a password" });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).send({ error: "sign in failed" });
      }

      try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, config.MY_SECRET);
        res.send({ token });
      } catch (e) {
        res.status(422).send({ error: "Invalid Password or Email" });
      }
    } catch (e) {}
  });
 
router.post("/signup", async (req, res) => {
const { email, password } = req.body;

if( !email || !password) {
    res.status(423).send({ error: "Missing email or password"});
}

// First check to see if the email alredy exits in the db
const user_exists = User.findOne({email: email.toLowerCase()});
if (user_exists) {
    res.status(423).send({ error: "This user already exists in our database"});
}

// If there user is not in the DB:
// 1. Go ahead and add it
// 2. Create a jwt token and return that
// 3. this token has to be sent back with every request for verification
const user = new User({
    _id: mongoose.Types.ObjectId(),
    email: email.toLowerCase(),
    password
});

try {
    await user.save();

    try {
        const token = jwt.sign({ userId: user._id }, config.MY_SECRET);
        res.send({ token });
    } catch (e) {
        res.status(422).send({ error: e });
    }
} catch (e) {}
});

router.get("/signout", async (req, res) => {
    res.status(200).send({token: ""})   
});
    

    
module.exports = router;