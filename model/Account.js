const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
   
    username: String,
    email:String,
    password: String,
    salt: String,
    experience:Number,
    level:Number,
    avatarPreset: String,
    lastAuthentication: Date,
   
});


mongoose.model('accounts', accountSchema);