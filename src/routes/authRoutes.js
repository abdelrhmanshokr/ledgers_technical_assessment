/**
 * authRoutes.js
 * Defines the authentication endpoints.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../validations/authValidations');
const validateRequest = require('../middleware/validationMiddleware');

// User registration
router.post('/signup', registerSchema, validateRequest, authController.signup);

// User login
router.post('/login', loginSchema, validateRequest, authController.login);

// Get current user (Protected)
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router;
