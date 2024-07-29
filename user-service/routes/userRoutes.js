const express = require('express');
const logInController = require('../controllers/logIn');
const googleSignUpController = require('../controllers/googleSignUp');
const signUpController = require('../controllers/signUp');
const updateUserController = require('../controllers/updateUser');
const healthCheckController = require('../controllers/healthCheck');
const updateCreditController = require('../controllers/updateCredit');

const router = express.Router();

router.post('/login', logInController.logIn);
router.post('/signup', signUpController.signUp);
router.post('/google-signup', googleSignUpController.googleSignUp);
router.post('/update-user', updateUserController.updateUser);
router.post('/update-credit', updateCreditController.updateCredit);
router.get('/health-check', healthCheckController.healthCheck);

module.exports = router;