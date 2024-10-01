const express = require('express');
const getTransaction = require('../controllers/getUserTransactions');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/get-transactions',authMiddleware,  getTransaction.getTransactions);

module.exports = router;
