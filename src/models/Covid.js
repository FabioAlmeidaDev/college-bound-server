const mongoose = require('mongoose');

const covidSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: 'date',
    required: true
  },
  q: {
    type: mongoose.Schema.Types.String,
    unique: false,
    required: true
  },
  v: {
    type: mongoose.Schema.Types.String,
    unique: false,
    required: true
  }
});

const getDate = () => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const newdate = year + '/' + month + '/' + day;
  return new Date(newdate);
};

// covidSchema.pre('save', function (next) {
//   console.log('HERE PRE', this, C);

//   // Covid.find({ userId: userId, date: getDate() }, function (err, docs) {
//   //   console.log('HERE PRE 2,', err, docs);

//   //     if (!docs.length) {
//   //       next();
//   //     } else {
//   //       const error = 'This athlete already checked in today! Try again tomorrow :-)';

//   //       next(new Error(error));
//   //     }
//   // });
// });
mongoose.model('Covid', covidSchema);
