const express = require('express');
const problemIssueController = require('../controllers/problemIssue');
const addCreditController = require('../controllers/addCredit');
const deleteUserController = require('../controllers/deleteUser');
const healthCheckController = require('../controllers/healthCheck');
const signupController = require('../controllers/signup');
const searchUsersController = require('../controllers/searchUsers');
//const googleSignUpController = require('../controllers/googleSignUp');
//const loginController = require('../controllers/login');
const updateUserController = require('../controllers/updateUser');
const router = express.Router();

router.post('/problem-issue', problemIssueController.problemIssue);
router.post('/add-credit', addCreditController.addCredit);
router.post('/delete-user', deleteUserController.deleteUserandAssosiatedData);
router.get('/health-check', healthCheckController.healthCheck);
router.post('/sign-up', signupController.signUp);
router.post('/search-users', searchUsersController.searchUsers);
//router.post('/google-sign-up', googleSignUpController.googleSignUp);
//router.post('/login', loginController.logIn);
router.post('/update-user', updateUserController.updateUser);

module.exports = router;