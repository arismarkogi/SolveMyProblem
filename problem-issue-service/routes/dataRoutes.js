// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const { submitData } = require('../controllers/dataController');
const upload = require('../middlewares/upload');

// Define the route and use the correct middleware and controller
router.post('/submit', upload.fields([{ name: 'location' }, { name: 'python' }]), submitData);

module.exports = router;
