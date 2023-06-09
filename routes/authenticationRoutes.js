const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, signin, updateAvatarPreset, getIcone, updateIcone, updateXp } = require('../controllers/accountController');

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
    .withMessage('password must be a minimum of 4 characters long'),
  signup
);

router.route('/updateAvatar').put(
  body('id').isString().withMessage('Invalid id'),
  body('avatarPreset').isString().withMessage('Invalid avatar preset'),
  updateAvatarPreset
);

router.route('/getIcone/:id').get(getIcone);

router.route('/updateIcone').put(
  body('id').isString().withMessage('Invalid id'),
  body('icone').isString().withMessage('Invalid icone'),
  updateIcone
);

router.route('/updateXp').put(
  body('id').isString().withMessage('Invalid id'),
  body('xp').isNumeric().withMessage('Invalid xp'),
  body('level').isNumeric().withMessage('Invalid level'),
  updateXp
);

module.exports = router;
