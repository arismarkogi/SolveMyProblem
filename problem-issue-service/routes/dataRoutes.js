// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const { submitData } = require('../controllers/dataController');
const upload = require('../middlewares/upload');
const healthCheckController = require('../controllers/healthCheck');

// Define the route and use the correct middleware and controller
router.post('/submit', upload.fields([{ name: 'location' }, { name: 'python' }]), submitData);
router.get('/health-check', healthCheckController.healthCheck);

module.exports = router;
