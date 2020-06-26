const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Athlete = mongoose.model('Athlete');

router.post('/add_athlete', async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT

  const { name, email, dob, group, fourDigitPin, password } = req.body;
  let missingFields = [];
  if (!name) {
    missingFields.push('name');
  }
  if (!dob) {
    missingFields.push('date of birth');
  }
  if (!group) {
    missingFields.push('group');
  }
  if (!fourDigitPin) {
    missingFields.push('4 digit pin code');
  }
  if (!password) {
    missingFields.push('password');
  }
  if (!email) {
    missingFields.push('email');
  }
  if (!name || !email || !dob || !group || !fourDigitPin || !password) {
    let fields = '';
    for (var i = 0; i < missingFields.length; i++) {
      if (i == missingFields.length - 1) {
        fields = fields + ' and ' + missingFields[i];
      } else {
        fields = i == 0 ? missingFields[i] : fields + ', ' + missingFields[i];
      }
    }

    return res.status(422).send({ error: `You must provide ${fields}` });
  }

  try {
    const athlete = new Athlete({
      name,
      dob: new Date(dob),
      group,
      fourDigitPin,
      password,
      email
    });
    await athlete.save();
    const token = jwt.sign({ userId: athlete._id }, 'MY_SECRET_KEY');
    res.send('Bearer ' + token);
  } catch (e) {
    res.status(422).send({ error: e.message });
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

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(422).send({ error: 'Must provide a password' });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ error: 'Email not found' });
    }
    try {
      await user.comparePassword(password);
      const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
      res.send({ token });
    } catch (e) {
      res.status(422).send({ error: 'Invalid Password or Email' });
    }
  } catch (e) {}
});

module.exports = router;
