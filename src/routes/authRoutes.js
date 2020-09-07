const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Athlete = mongoose.model("Athlete");

router.post("/add_athlete", async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT

  const { name, email, dob, group, fourDigitPin, password, guardian, gym, phone_no } = req.body;
  let missingFields = [];
  if (!name) {
    missingFields.push("name");
  }
  if (!guardian) {
    missingFields.push("guardian");
  }
  if (!dob) {
    missingFields.push("date of birth");
  }
  if (!gym) {
    missingFields.push("gym");
  }
  if (!group) {
    missingFields.push("group");
  }
  if (!fourDigitPin) {
    missingFields.push("4 digit pin code");
  }
  if (!password) {
    missingFields.push("password");
  }
  if (!email) {
    missingFields.push("email");
  }
  if (!phone_no) {
    missingFields.push("phone number");
  }
  if (!guardian || !phone_no || !gym || !name || !email || !dob || !group || !fourDigitPin || !password) {
    let fields = "";
    for (var i = 0; i < missingFields.length; i++) {
      if (i == missingFields.length - 1) {
        fields = fields + " and " + missingFields[i];
      } else {
        fields = i == 0 ? missingFields[i] : fields + ", " + missingFields[i];
      }
    }

    return res.status(422).send({ error: `You must provide ${fields}` });
  }

  // START: check if there is already an entry for this user
  const docs = await Athlete.find({ name: { $regex: new RegExp("^" + name.toLowerCase().trim(), "i") } }, (err, docs) => {});
  if (docs.length > 0) {
    const error = "There is already an entry with this name in our database. If you dont see it in the list, try clicking the refresh button";
    res.send({ error });
  } else {
    try {
      const athlete = new Athlete({
        _id: mongoose.Types.ObjectId(),
        guardian,
        name,
        dob: new Date(dob),
        group,
        gym,
        fourDigitPin,
        password,
        email,
        phone_no,
      });
      await athlete.save();
      const token = jwt.sign({ userId: athlete._id }, "MY_SECRET_KEY");
      res.send("Bearer " + token);
    } catch (e) {
      res.status(422).send({ error: e.message });
    }
  }
});

// router.post("/signup", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = new User({ email, password });
//     await user.save();
//     const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
//     res.send("Bearer " + token);
//   } catch (e) {
//     res.status(422).send(e.message);
//   }
// });

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(422).send({ error: "Must provide a password" });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }
    try {
      await user.comparePassword(password);
      const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
      res.send({ token });
    } catch (e) {
      res.status(422).send({ error: "Invalid Password or Email" });
    }
  } catch (e) {}
});

module.exports = router;
