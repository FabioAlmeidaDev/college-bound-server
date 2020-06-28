const mongoose = require('mongoose');

const covidSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Athlete'
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

mongoose.model('Covid', covidSchema);
