const authMiddleware = require('./authMiddleware');
const config = require('../config/keys');
const requireLogin = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. You must be logged in to access this router.' });
    }
    next();
  });
};

module.exports = requireLogin;
