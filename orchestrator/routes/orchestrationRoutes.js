const express = require('express');
const problemIssueController = require('../controllers/problemIssue');
const addCreditController = require('../controllers/addCredit');
const deleteUserController = require('../controllers/deleteUser');
const healthCheckController = require('../controllers/healthCheck');

const router = express.Router();

router.post('/problem-issue', problemIssueController.problemIssue);
router.post('/add-credit', addCreditController.addCredit);
router.post('/delete-user', deleteUserController.deleteUserandAssosiatedData);
router.get('/health-check', healthCheckController.healthCheck);

module.exports = router;