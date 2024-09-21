const express = require('express');
const problemIssueController = require('../controllers/problemIssue');
const addCreditController = require('../controllers/addCredit');
const deleteUserController = require('../controllers/deleteUser');
const healthCheckController = require('../controllers/healthCheck');
const signupController = require('../controllers/signup');
const searchUsersController = require('../controllers/searchUsers');
const loginController = require('../controllers/login');
const userProfileController = require('../controllers/userProfile');
const updateUserController = require('../controllers/updateUser');
const getUserController = require('../controllers/getUserById');
const getgoogleSignUpController = require('../controllers/googleSignup');
const getStatsController = require('../controllers/stats');
const router = express.Router();

router.post('/submit-problem', problemIssueController.problemIssue);
router.post('/add-credit', addCreditController.addCredit);
router.post('/delete-user', deleteUserController.deleteUserandAssosiatedData);
router.get('/health-check', healthCheckController.healthCheck);
router.post('/sign-up', signupController.signUp);
router.post('/search-users', searchUsersController.searchUsers);
router.get('/user-profile', userProfileController.getUserProfile);
router.post('/login', loginController.logIn);
router.post('/update-user', updateUserController.updateUser);
router.get('/get-user-by-id/:userId', getUserController.getUserById);
router.post('/google-signup', getgoogleSignUpController.googleSignUp);
router.get('/get-stats', getStatsController.getStats)

module.exports = router;
