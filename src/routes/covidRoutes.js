const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const auth = require('../middleware/requireAuth');

const Covid = mongoose.model('Covid');
const Questions = mongoose.model('Questions');
const Athlete = mongoose.model('Athlete');

const router = express.Router();

const getDate = () => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const newdate = year + '-' + month + '-' + day + ' 04:00:00.000';
  const output = new Date(newdate);
  return output;
};

router.post('/covid/add', async (req, res) => {
  const { userId, questions, password } = req.body;

  const athlete = await Athlete.findOne({ _id: userId });

  try {
    await athlete.comparePassword(password);

    // START: check if there is already an entry for this user today
    const docs = await Covid.find({ userId: userId, date: getDate() }, (err, docs) => {});
    if (docs.length > 0) {
      const error = 'This athlete already checked in today! Try again tomorrow :-)';
      res.send({ error });
    } else {
      if (questions) {
        questions.map((question) => {
          question._id = mongoose.Types.ObjectId();
          question.userId = userId;
          question.date = getDate();
          return question;
        });
        Covid.create(questions, function (err) {
          res.send(true);

          if (err) {
            // res.status(422).send({ error: e.message });
          } else {
            // res.send('success');
          }
        });
      }
      // res.send(true);
    }
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
  const covid = await Covid.find().populate(['userId']);
  res.send(covid);
});
router.post('/covid/all/dates', async (req, res) => {
  const final = [];
  try {
    let { from, to } = req.body;
    let last24hr = new Date();
    last24hr.setDate(last24hr.getDate() - 1);

    from = from ? new Date(from) : last24hr;
    to = to ? new Date(to) : new Date();

    const covid = await Covid.find({ date: { $gte: from, $lte: to } })
      .populate('userId', 'name group')
      .lean()
      .exec();

    const flatArray = covid.map((item) => {
      return { ...item.userId, ...item, userId: item.userId ? item.userId._id : null };
    });

    const reducedArray = flatArray.reduce((prev, curr) => {
      let obj = {};
      if (prev[curr.name]) {
        const yes = curr.v == 'true' ? prev[curr.name].yes + 1 : prev[curr.name].yes;
        const no = curr.v == 'false' ? prev[curr.name].no + 1 : prev[curr.name].no;
        const date = curr.date;
        const group = curr.group;
        const name = curr.name;

        obj = {
          yes,
          no,
          date,
          group,
          name
        };
      } else {
        obj = {
          yes: curr.v == 'true' ? 1 : 0,
          no: curr.v == 'false' ? 1 : 0,
          date: curr.date,
          group: curr.group,
          name: curr.name
        };
      }
      return { ...prev, [curr.name]: obj };
    }, {});

    for (let item in reducedArray) {
      final.push(reducedArray[item]);
    }
  } catch (err) {
    console.log('Error: ' + err);
  }
  res.send(final);
});
router.get('/covid/questions', async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const question = await Questions.find();
  res.send(question);
});
module.exports = router;
