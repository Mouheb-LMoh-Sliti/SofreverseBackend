const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {signup, signin} = require("../controllers/accountController");

router.route('/signin').post(signin);

router.route('/signup').post(
  body('username')
    .isAlphanumeric()
    .withMessage('username must be without special characters')
    .isLength({ min: 3 })
    .withMessage('username must be between 3 and 20 characters long'),
  body('email').isEmail().withMessage('email invalid'),
  body('password')
    .isLength({ min: 4 })
    .withMessage('password must be a minimum 4 characters long'),
  signup
);

module.exports = router;
