const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  q: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true
  }
});

mongoose.model('Questions', questionSchema);
