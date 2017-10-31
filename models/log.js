const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  printer: {
    type: String,
    required: true
  },
  jobID: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

mongoose.model('Log', logSchema);
