const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/requireAuth');

const Covid = mongoose.model('Covid');
const Questions = mongoose.model('Questions');

const router = express.Router();

router.post('/covid/add', async (req, res) => {
  const { userId, date, questions } = req.body;
  console.log('Question: ', questions);
  let questionsArray = [];
  if (questions) {
    for (const question of Object.keys(questions)) {
      const q = {
        userId: userId,
        date: new Date(),
        question: question,
        answer: questions[question]
      };
      questionsArray.push(q);
    }

    Covid.create(questionsArray, function (err) {
      if (err) {
        // res.status(422).send({ error: e.message });
      } else {
        // res.send('success');
      }
    });
  }
  // try {
  //   const athlete = new Athlete({
  //     name,
  //     dob: new Date(dob),
  //     group,
  //     fourDigitPin,
  //     password,
  //     email
  //   });
  //   await athlete.save();
  //   const token = jwt.sign({ userId: athlete._id }, 'MY_SECRET_KEY');
  //   res.send('Bearer ' + token);
  // } catch (e) {
  //   res.status(422).send({ error: e.message });
  // }
  res.send('true');
});
router.get('/covid/find', async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const covid = await Covid.find({ userId: req.user.userid });
  res.send(covid);
});
router.get('/covid/all', async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const covid = await Covid.find();
  res.send(covid);
});
router.get('/covid/questions', async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const question = await Questions.find();
  res.send(question);
});
module.exports = router;
