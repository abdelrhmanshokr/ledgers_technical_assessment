const { validationResult } = require('express-validator');

/**
 * Middleware to check for validation errors and return a 400 response
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 400;
    // Optional: attach full errors array if needed
    error.details = errors.array();
    return next(error);
  }
  next();
};

module.exports = validateRequest;
