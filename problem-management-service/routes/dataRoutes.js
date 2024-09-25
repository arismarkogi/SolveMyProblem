const express = require('express');
const router = express.Router();
const { submitData } = require('../controllers/problemIssue');
const { receiveSolution } = require('../controllers/receiveSolution');
const { getProblems } = require('../controllers/getProblems');
const { getStats } = require('../controllers/stats');
const upload = require('../middlewares/upload');
const healthCheckController = require('../controllers/healthCheck');
const { deleteProblem } = require('../controllers/problemIssue');
const { getProblemById } = require('../controllers/getProblem');

// Define the routes
router.post('/submit-problem', upload, submitData);
router.post('/problemIssue', upload, submitData);
router.get('/receiveSolution', receiveSolution);
router.get('/getProblems', getProblems);
router.get('/stats', getStats);
router.get('/health-check', healthCheckController.healthCheck);
router.delete('/deleteProblem/:id', deleteProblem);
router.get('/getProblem/:problemId', getProblemById);

module.exports = router;
