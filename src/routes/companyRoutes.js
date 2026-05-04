/**
 * companyRoutes.js
 * Definitions for company management routes.
 */

const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection to all company routes
router.use(protect);

// Create a new company
router.post('/', companyController.createCompany);

// List user's companies
router.get('/', companyController.getCompanies);

// Get company details by ID
router.get('/:id', companyController.getCompanyById);

module.exports = router;
