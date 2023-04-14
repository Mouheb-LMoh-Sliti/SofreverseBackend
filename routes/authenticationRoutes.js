const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const passwordRegex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})");

module.exports = app => {
    // Create
    app.post('/account/create', async (req, res) => {
        var response = {};
        const { rEmail, rUsername, rPassword } = req.body;

        if(1>10)
        {
            response.code = 1;
            response.msg = "Invalid username";
            res.send(response);
            return;
        }

        if(1>10)
        {
            response.code = 2;
            response.msg = "Unsafe password";
            res.send(response);
            return;
        }

        var userAccount = await Account.findOne({ email: rEmail, username: rUsername},'_id');
        if(userAccount == null){
            // Create a new account
            console.log("Create new account...")

            // Generate a unique access token
            crypto.randomBytes(32, function(err, salt) {
                if(err){
                    console.log(err);
                }

                bcrypt.hash(rPassword, 10, async (err, hash) => {
                   
                    var newAccount = new Account({
                        email: rEmail,
                        username : rUsername,
                        password : hash,
                        avatarPreset : "0,-,0,-,0",
                        experience : 1,
                        level : 1,
                        lastAuthentication : Date.now(),
                       
                        
                    });
                    await newAccount.save();
                
                    response.code = 0;
                    response.msg = "Account created";
                    response.data = ( ({email,username, experience,level,avatarPreset}) => ({email, username, experience,level,avatarPreset }) )(newAccount);
                    res.send(response);
                    return;
                });
                
            });
        } else {
            response.code = 2;
            response.msg = "Account already exists";
            res.send(response);
        }
        
        return;
    });

    
    
    // Login
    app.post('/account/login', async (req, res) => {

        var response = {};

        const { rUsername, rPassword } = req.body;
        if(rUsername == null || !passwordRegex.test(rPassword))
        {
            response.code = 0;
            response.msg = "Invalid credentials";
            res.send(response);
            return;
        }

        var userAccount = await Account.findOne({ username: rUsername}, 'username adminFlag password');
        if(userAccount != null){
            bcrypt.compare(rPassword, userAccount.password, async (err, success) => {
                if (success) {
                    userAccount.lastAuthentication = Date.now();
                    await userAccount.save();
            
                    response.code = 0;
                    response.msg = "Account found";
                    response.data = ( ({username, experience,level,avatarPreset}) => ({ username ,experience,level,avatarPreset }) )(userAccount);
                    res.send(response);
            
                    return;
                } else {
                    response.code = 1;
                    response.msg = "Invalid credentials";
                    res.send(response);
                    return;
                }
            });
            
        }
        else{
            response.code = 2;
            response.msg = "username does not exist";
            res.send(response);
            return;
        }
    });

}