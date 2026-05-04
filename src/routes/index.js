/**
 * src/routes/index.js
 * Main router that aggregates all sub-routers and applies the global /api prefix.
 */

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Mount auth routes
router.use('/v1/auth', authRoutes);

module.exports = router;
