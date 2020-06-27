const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const athleteSchema = new mongoose.Schema({
  name: {
    type: 'string',
    unique: true,
    required: true
  },
  group: {
    type: 'string',
    unique: true,
    required: true
  },
  dob: {
    type: 'string',
    unique: true,
    required: true
  },
  fourDigitPin: {
    type: 'string',
    unique: true,
    required: true
  },
  email: {
    type: 'string',
    unique: true,
    required: true
  },
  password: {
    type: 'string',
    required: true
  }
});
athleteSchema.pre('save', function (next) {
  // needs to use the keyword function so the keyword THIS points to the user and not this entire file which would happen if i used an arrow function (funny that by using the arrow function the THIS keyword has a different value, go figure)
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  });
});

athleteSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(false);
      }
      resolve(true);
    });
  });
};

mongoose.model('Athlete', athleteSchema);