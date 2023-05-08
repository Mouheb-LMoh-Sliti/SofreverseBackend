const express = require('express');
const keys = require('./config/keys.js');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Setting up DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Setup database models
require('./model/Account');
require('./model/Meeting');


// Setup the routes
const authenticationRoutes = require('./routes/authenticationRoutes');
app.use('/api/auth', authenticationRoutes);

const friendsRoutes = require('./routes/friendsRoutes');
app.use('/api/friends', friendsRoutes);


const meetingRoutes = require('./routes/meetingRoutes');
app.use('/api/meet', meetingRoutes);

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

app.listen(keys.port, () => {
  console.log(`Listening on ${keys.port}`);
});
