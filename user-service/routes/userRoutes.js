const express = require('express');
const verifyToken = require('../utils/authMiddleware');  // Import the middleware
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
router.post('/update-user', verifyToken, updateUserController.updateUser);  // Protect this route
router.post('/update-credit', verifyToken, updateCreditController.updateCredit);  // Protect this route
router.get('/health-check', healthCheckController.healthCheck);

module.exports = router;
