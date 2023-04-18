const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = (app) => {
  // Create a new account
  app.post('/account/create', async (req, res) => {
    try {
      const { rEmail, rUsername, rPassword } = req.body;

      // Check if account already exists
      const existingAccount = await Account.findOne({username: rUsername });
      if (existingAccount) {
        return res.status(400).json({ error: 'Account already exists' });
      }

      // Generate a unique access token
      //const token = crypto.randomBytes(32).toString('hex');

      // Hash password
      const hashedPassword = await bcrypt.hash(rPassword, 10);

      // Create new account
      const newAccount = new Account({
        email: rEmail,
        username: rUsername,
        password: hashedPassword,
        avatarPreset: '0,-,0,-,0',
        experience: 1,
        level: 1,
        lastAuthentication: Date.now(),
      });

      // Save account to database
      await newAccount.save();

      // Return success response with account information
      const { email, username, experience, level, avatarPreset } = newAccount;
      return res.json({ email, username, experience, level, avatarPreset, });
    } catch (err) {
      console.error(`Error creating account: ${err}`);
      return res.status(500).json({ error: 'An error occurred while creating the account' });
    }
  });

  // Login to an existing account
  app.post('/account/login', async (req, res) => {
    try {
      const { rUsername, rPassword } = req.body;

      // Find account in database
      const userAccount = await Account.findOne({ username: rUsername });
      if (!userAccount) {
        return res.status(400).json({ error: 'Account not found' });
      }

      // Compare password hashes
      const passwordMatches = await bcrypt.compare(rPassword, userAccount.password);
      if (!passwordMatches) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Update last authentication timestamp
      userAccount.lastAuthentication = Date.now();
      await userAccount.save();

      // Return success response with account information
      const { username, experience, level, avatarPreset } = userAccount;
      return res.json({ username, experience, level, avatarPreset });
    } catch (err) {
      console.error(`Error logging in: ${err}`);
      return res.status(500).json({ error: 'An error occurred while logging in' });
    }
  });
};
