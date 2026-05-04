/**
 * companyRoutes.js
 * Definitions for company management routes.
 */

const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { checkCompanyAccess } = require('../middleware/companyMiddleware');
const { createCompanySchema, companyIdParamSchema } = require('../validations/companyValidations');
const validateRequest = require('../middleware/validationMiddleware');

// Apply protection to all company routes
router.use(protect);

// Create a new company
router.post('/', createCompanySchema, validateRequest, companyController.createCompany);

// Create a new companyUser association (Optional based on userId in request body)
router.post('/:companyId/users', companyIdParamSchema, validateRequest, companyController.createCompanyUser);

// List user's companies
router.get('/', companyController.getCompanies);

// Get company details by ID (Requires MEMBER access)
router.get('/:companyId', companyIdParamSchema, validateRequest, checkCompanyAccess(), companyController.getCompanyById);

// Get company dashboard data (Requires MEMBER access)
router.get('/:companyId/dashboard', companyIdParamSchema, validateRequest, checkCompanyAccess(), companyController.getCompanyDashboard);

module.exports = router;
