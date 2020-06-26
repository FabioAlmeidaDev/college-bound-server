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
  question: {
    type: mongoose.Schema.Types.String,
    unique: false,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.String,
    unique: false,
    required: true
  }
});

mongoose.model('Covid', covidSchema);
