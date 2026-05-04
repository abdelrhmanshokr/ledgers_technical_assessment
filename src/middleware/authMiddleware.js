/**
 * authMiddleware.js
 * Middleware to protect routes by verifying JWT access tokens.
 */

const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

/**
 * Protect middleware
 * Verifies the Bearer token in the Authorization header and verifies user existence.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if Authorization header exists and starts with Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check if token exists
    if (!token) {
      const error = new Error('Not authorized, no token provided');
      error.statusCode = 401;
      return next(error);
    }

    // 3. Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Verify user exists in database and fetch full details (excluding password)
      // This addresses "User Existence Check" and "Context Availability" concerns.
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        const error = new Error('Not authorized, user no longer exists');
        error.statusCode = 401;
        return next(error);
      }

      // 5. Attach full user object to the request
      req.user = user;
      
      next();
    } catch (err) {
      const error = new Error('Not authorized, token failed or expired');
      error.statusCode = 401;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
