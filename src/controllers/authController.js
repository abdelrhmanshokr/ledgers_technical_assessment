/**
 * authController.js
 * Controller handlers for authentication routes.
 */

/**
 * Handle user signup
 * POST /api/v1/auth/signup
 */
const signup = async (req, res) => {
  res.status(201).json({ message: 'Signup placeholder' });
};

/**
 * Handle user login
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
  res.status(200).json({ message: 'Login placeholder' });
};

module.exports = {
  signup,
  login,
};
