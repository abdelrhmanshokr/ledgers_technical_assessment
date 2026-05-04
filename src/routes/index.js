/**
 * src/routes/index.js
 * Main router that aggregates all sub-routers and applies the global /api prefix.
 */

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const companyRoutes = require('./companyRoutes');
const transactionRoutes = require('./transactionRoutes');

// Mount auth routes
router.use('/v1/auth', authRoutes);

// Mount company routes
router.use('/v1/companies', companyRoutes);

// Mount transaction routes as a sub-resource of companies
router.use('/v1/companies/:companyId/transactions', transactionRoutes);

module.exports = router;
