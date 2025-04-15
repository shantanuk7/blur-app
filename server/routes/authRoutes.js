const express = require('express');
const router = express.Router();
const { register, login, verifyEmail } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../utils/validators');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/verify-email', verifyEmail);

module.exports = router;