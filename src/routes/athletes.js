const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/requireAuth');

const Athlete = mongoose.model('Athlete');

const router = express.Router();

// router.use(auth);

router.get('/athletes/find', async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const athletes = await Athlete.find({ userId: req.user._id });
  res.send(athletes);
});
router.get('/athletes/all', async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const athletes = await Athlete.find();
  res.send(athletes);
});
module.exports = router;
