const express = require('express');
const keys = require('./config/keys');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Setting up DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Setup database models
require('./model/Account');

// Setup the routes
const authenticationRoutes = require('./routes/authenticationRoutes');
app.use('/api/auth', authenticationRoutes);
const accountController = require('./controllers/accountController');
//app.put('/api/auth/:id/avatarPreset', accountController.updateAvatarPreset);

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

app.listen(keys.port, () => {
  console.log(`Listening on ${keys.port}`);
});
