/**
 * companyRoutes.js
 * Definitions for company management routes.
 */

const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { checkCompanyAccess } = require('../middleware/companyMiddleware');

// Apply protection to all company routes
router.use(protect);

// Create a new company
router.post('/', companyController.createCompany);

// Create a new companyUser association (Optional based on userId in request body)
router.post('/:companyId/users', companyController.createCompanyUser);

// List user's companies
router.get('/', companyController.getCompanies);

// Get company details by ID (Requires MEMBER access)
router.get('/:companyId', checkCompanyAccess(), companyController.getCompanyById);

module.exports = router;
