import mongoose from 'mongoose';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema(
    {
        username: 
           { 
                type: String,
                unique: [true, "username already taken"],
                required : true
            },

        email :
            { 
                type: String,
                unique: [true, "mail already taken"],
                required : true
             },

        password: 
             { 
                type: String,
                required : true
             },

        salt: 
            { 
                type: String,
                required : true
            },
            
        experience : 
            { 
                type: Number,
            },
        
        level: 
            { 
                type: Number,
             },

        avatarPreset: 
            {
               type: String,
               required: true
            },
    
            lastAuthentication: Date,
   
});

export default model ("accounts",accountSchema);
mongoose.model('accounts', accountSchema);