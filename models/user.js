const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'user']
  },
  printer: {
    type: Number,
    required: true,
    default: 0
  },
  pagePrinted: {
    type: Number,
    required: true,
    default: 0
  },
  totalPageLimit: {
    type: Number,
    required: true,
    default: config.totalPageLimit
  }
}, {
  timestamps: true
});

userSchema.statics.createSalt = function() {
  return bcrypt.genSalt(10);
};
userSchema.statics.createHash = function(val) {
  return bcrypt.hash(val, 10);
};

userSchema.methods.comparePassword = function(val) {
  return bcrypt.compare(val, this.password);
};

mongoose.model('User', userSchema);
