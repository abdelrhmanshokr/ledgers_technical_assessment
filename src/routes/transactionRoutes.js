/**
 * transactionRoutes.js
 * Definitions for transaction management routes.
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { checkCompanyAccess } = require('../middleware/companyMiddleware');

// All transaction routes require authentication and company access
router.use(protect);
router.use(checkCompanyAccess());

// Create a new transaction
router.post('/', transactionController.createTransaction);

// List transactions for the company
router.get('/', transactionController.getTransactions);

module.exports = router;
