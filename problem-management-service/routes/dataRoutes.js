// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const { submitData } = require('../controllers/problemIssue');
const {receiveSolution} = require('../controllers/receiveSolution');
const {getProblems} = require('../controllers/getProblems');
const {getStats} = require('../controllers/stats');
const upload = require('../middlewares/upload');
const healthCheckController = require('../controllers/healthCheck');

// Define the route and use the correct middleware and controller
router.post('/problemIssue', upload.fields([{ name: 'location' }]), submitData);
router.get('/receiveSolution', receiveSolution)
router.get('/getProblems', getProblems)
router.get('/stats', getStats)
router.get('/health-check', healthCheckController.healthCheck);

module.exports = router;
