const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: "string",
    unique: true,
    required: true
  },
  password: {
    type: "string",
    required: true
  },
  fullName: {
    type: "string",
    required: true
  },
  accountType: {
    type: "string",
    required: true
  },
  dob: {
    type: "date",
    required: true
  },
  gradYear: {
    type: "number",
    required: true
  },
  guardianName: {
    type: "string",
    required: true
  },
  guardiaEmail: {
    type: "string",
    required: true
  },
  gym: {
    type: "string",
    required: true
  },
  coachesName: {
    type: "string",
    required: true
  },
  coachEmail: {
    type: "string",
    required: true
  },
  youtubeChannel: {
    type: "string",
  },
  instagramAccount: {
    type: "string",
  },
  acceptedVerbalOffer: {
    type: "boolean",
  },
  acceptedWrittenOffer: {
    type: "boolean",
  },
});
userSchema.pre("save", function(next) {
  // needs to use the keyword function so the keyword THIS points to the user and not this entire file which would happen if i used an arrow function (funny that by using the arrow function the THIS keyword has a different value, go figure)
  if (!this.isModified("password")) {
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

userSchema.methods.comparePassword = function(candidatePassword) {
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

mongoose.model("User", userSchema);
