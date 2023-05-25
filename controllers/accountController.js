
require("dotenv").config();

const Account = require("../model/Account");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Account.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const success = await bcrypt.compare(password, user.password);
    if (success) {
      // Calculate time difference between current date and last authenticated date
      const timeDiff = new Date() - user.lastAuthenticated;
      const hoursDiff = Math.round(timeDiff / (1000 * 60 * 60));

      // Update last authentication date and time
      user.lastAuthenticated = new Date();
      await user.save();

      // Create and sign a JWT token
      const token = jwt.sign({ id: user.id },""+process.env.jwtSecret, {
        expiresIn: "10y",
      });
     

      // Return all user data, time difference and JWT token in response
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        experience: user.experience,
        level: user.level,
        avatarPreset: user.avatarPreset,
        lastAuthenticated: user.lastAuthenticated,
        passed24Hours: hoursDiff >= 24,
        icone : "default",
        token,
      });
    } else {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const newUser = await Account.create({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      salt: salt,
      experience: 0,
      level: 1,
      avatarPreset: "0,-,0,-,0",
      icone : "default",
    });

    // Create and sign a JWT token
    console.log('jwtSecret:', process.env.jwtSecret);

    const token = jwt.sign({ id: newUser.id }, ""+process.env.jwtSecret, {
      expiresIn: "10y",
      algorithm: 'HS256'
    });

    // Return user data and JWT token in response
    return res.status(200).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      experience: newUser.experience,
      level: newUser.level,
      avatarPreset: newUser.avatarPreset,
      icone: newUser.icone,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(500).json({ error: "Username or email already taken" });
    } else {
      return res.status(500).json({ error: "Server Error" });
    }
  }
};

const updateAvatarPreset = async (req, res) => {
  try {
    const { id } = req.body;
    const { avatarPreset } = req.body;

    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    user.avatarPreset = avatarPreset;
    await user.save();

    return res.status(200).json({ message: "Avatar preset updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

const updateIcone = async (req, res) => {
  try {
    const { id } = req.body;
    const { icone } = req.body;

    const updatedUser = await Account.findByIdAndUpdate(
      id,
      { icone: icone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Icone updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};
const updateXp = async (req, res) => {
  try {
    const { id } = req.body;
    const { xp } = req.body;

    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.experience = xp;
    await user.save();
    return res.status(200).json({ message: "Experience updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};


module.exports = { signin, signup, updateAvatarPreset, updateIcone, updateXp };


