const { body, param } = require('express-validator');

const createCompanySchema = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
];

const companyIdParamSchema = [
  param('companyId')
    .isInt({ min: 1 })
    .withMessage('Company ID must be a positive integer'),
];

module.exports = {
  createCompanySchema,
  companyIdParamSchema,
};
