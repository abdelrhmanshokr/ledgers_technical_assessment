/**
 * transactionRoutes.js
 * Definitions for transaction management routes.
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { checkCompanyAccess } = require('../middleware/companyMiddleware');
const { createTransactionSchema, getTransactionsFiltersSchema } = require('../validations/transactionValidations');
const { companyIdParamSchema } = require('../validations/companyValidations');
const validateRequest = require('../middleware/validationMiddleware');
const idempotency = require('../middleware/idempotencyMiddleware');

// All transaction routes require authentication and company access
router.use(protect);
router.use(companyIdParamSchema, validateRequest, checkCompanyAccess());

// Create a new transaction (with idempotency check)
router.post('/', createTransactionSchema, validateRequest, idempotency, transactionController.createTransaction);

// List transactions for the company
router.get('/', getTransactionsFiltersSchema, validateRequest, transactionController.getTransactions);

module.exports = router;
