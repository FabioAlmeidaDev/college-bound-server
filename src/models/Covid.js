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

mongoose.model('Covid', covidSchema);
