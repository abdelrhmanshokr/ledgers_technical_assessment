const { body, query } = require('express-validator');

const createTransactionSchema = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value > 0)
    .withMessage('Amount must be positive'),
  body('type')
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format (ISO8601 expected)'),
];

const getTransactionsFiltersSchema = [
  query('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type filter must be either INCOME or EXPENSE'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid startDate format (ISO8601 expected)'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid endDate format (ISO8601 expected)'),
];

module.exports = {
  createTransactionSchema,
  getTransactionsFiltersSchema,
};
