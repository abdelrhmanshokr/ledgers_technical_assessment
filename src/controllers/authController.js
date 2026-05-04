/**
 * authController.js
 * Controller handlers for authentication routes.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { isValidEmail, isStrongPassword } = require('../utils/validation');

/**
 * Handle user signup
 * POST /api/v1/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    if (!isValidEmail(email)) {
      const error = new Error('Invalid email format');
      error.statusCode = 400;
      throw error;
    }

    if (!isStrongPassword(password)) {
      const error = new Error('Password must be at least 8 characters long');
      error.statusCode = 400;
      throw error;
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 409;
      throw error;
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create user record
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    // 5. Generate JWT token (minimizing payload to just userId)
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 6. Return response
    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
        access_token: token,
      },
    });
  } catch (error) {
    next(error);
  }
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
