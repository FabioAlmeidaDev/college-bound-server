const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/requireAuth');

const Covid = mongoose.model('Covid');
const Questions = mongoose.model('Questions');
const Athlete = mongoose.model('Athlete');

const router = express.Router();

router.post('/covid/add', async (req, res) => {
  const { userId, questions, password } = req.body;

  const athlete = await Athlete.findOne({ _id: userId });

  const getDate = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const newdate = year + '/' + month + '/' + day;
    return new Date(newdate);
  };

  try {
    await athlete.comparePassword(password);

    // START: check if there is already an entry for this user today
    await Covid.count({ userId: userId, date: getDate() }, (err, docs) => {
      console.log('COUNT', err, docs, userId, getDate());
      if (docs > 0) {
        console.log('COUNT 2', err, docs);

        const error = 'This athlete already checked in today! Try again tomorrow :-)';
        res.send({ error });
      } else {
        console.log('COUNT 3', err, docs);

        if (questions) {
          console.log('COUNT 4', err, docs);

          questions.map((question) => {
            question.userId = userId;
            question.date = getDate();
            return question;
          });

          Covid.create(questions, function (err) {
            console.log('COUNT 5', err, docs);

            if (err) {
              // res.status(422).send({ error: e.message });
            } else {
              // res.send('success');
            }
          });
        }
        res.send(docs);
      }
    });
  } catch (e) {
    const error = 'Invalid 4 Digit PIN';
    res.send({ error });
  }
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
