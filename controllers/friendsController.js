const mongoose = require('mongoose');
const Account = mongoose.model('Account');

exports.addFriendByUsername = async (req, res) => {
  const { username } = req.body;

  try {
    // Find the user trying to add a friend
    const currentUser = await Account.findById(req.user.id);
    if (!currentUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the friend by username
    const friend = await Account.findOne({ username: username });
    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    // Check if the user is already friends with the friend
    if (currentUser.friends.includes(friend._id)) {
      return res.status(400).json({ error: 'Already friends with this user' });
    }

    // Add the friend to the user's friend list
    currentUser.friends.push(friend._id);

    // Add the user to the friend's friend list
    friend.friends.push(currentUser._id);

    await currentUser.save();
    await friend.save();

    return res.json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

  

exports.getFriends = async (req, res) => {
  try {
    // Find the user's friend list
    const currentUser = await Account.findById(req.user._id).populate('friends');
    if (!currentUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.json({ friends: currentUser.friends });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
