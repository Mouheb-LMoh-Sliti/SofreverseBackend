const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const Account = require('../model/Account');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please provide a valid token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const user = await Account.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. User not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

module.exports = authMiddleware;
