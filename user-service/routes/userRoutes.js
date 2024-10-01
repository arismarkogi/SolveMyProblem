const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');  // Import the middleware
const logInController = require('../controllers/logIn');
const googleSignUpController = require('../controllers/googleSignUp');
const signUpController = require('../controllers/signUp');
const updateUserController = require('../controllers/updateUser');
const healthCheckController = require('../controllers/healthCheck');
const updateCreditController = require('../controllers/updateCredit');
const searchUserController = require('../controllers/searchUsers');
const getUserController = require('../controllers/getUserProfile');
const getUserTokenController = require('../controllers/getUser');
const router = express.Router();

router.post('/login', logInController.logIn);
router.post('/signup', signUpController.signUp);
router.post('/google-signup', googleSignUpController.googleSignUp);
router.post('/update-user', verifyToken, updateUserController.updateUser);  // Protect this route
router.post('/update-credit', verifyToken, updateCreditController.updateCredit);  // Protect this route
router.get('/health-check', healthCheckController.healthCheck);
router.get('/search-users', verifyToken, searchUserController.searchUsers);  // Protect this route
router.get('/get-user-by-id/:userId', verifyToken, getUserController.getUserProfile);  // Protect this route
router.get('/get-user', verifyToken, getUserTokenController.getUser);  // Protect this route
module.exports = router;
