const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  avatarPreset: {
    type: String,
    required: true,
    default: "0,-,0,-,0"
  },
  lastAuthentication: {
    type: Date,
    default: Date.now
  },
  icone :{
    type: String,
    default: "default",
    },
  token:{
    type :String,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
});
module.exports = mongoose.model('Account', accountSchema);
