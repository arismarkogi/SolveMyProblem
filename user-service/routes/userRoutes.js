const express = require('express');
const logInController = require('../controllers/logIn');
const googleSignUpController = require('../controllers/googleSignUp');
const signUpController = require('../controllers/signUp');
const router = express.Router();

router.post('/login', logInController.logIn);
router.post('/signup', signUpController.signUp);
router.post('/google-signup', googleSignUpController.googleSignUp);

module.exports = router;