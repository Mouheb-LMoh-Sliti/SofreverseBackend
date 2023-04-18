
import express from 'express';
import mongoose from 'mongoose';
import Account from './model/Account';
import authentication from './routes';

const express = require('express');
const keys = require('./config/keys.js');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

// Setting up DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

// Setup database models
require('./model/Account');

// Setup the routes
require('./routes/authenticationRoutes')(app);

mongoose.set("debug", true);
mongoose.Promise=global.Promise;



app.listen(keys.port, () => {
    console.log("Listening on " + keys.port);
});