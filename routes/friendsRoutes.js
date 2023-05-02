const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const friendsController = require('../controllers/friendsController');

// Route to add a friend by username
router.post('/add', requireLogin, friendsController.addFriendByUsername);

// Route to get the user's friends
router.get('/friends', requireLogin, friendsController.getFriends);

module.exports = router;
