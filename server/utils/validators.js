const { body } = require('express-validator');

exports.registerValidation = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').not().isEmpty().withMessage('Password is required')
];
