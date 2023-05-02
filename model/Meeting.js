const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  startTime: {
    type: Date,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
});

module.exports = mongoose.model('Meeting', meetingSchema);
