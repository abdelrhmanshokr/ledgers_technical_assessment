/**
 * validation.js
 * Centralized validation logic.
 */

/**
 * Validates an email address using a regex.
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength.
 * @param {string} password 
 * @returns {boolean}
 */
const isStrongPassword = (password) => {
  // Simple check for now: min 8 characters
  return typeof password === 'string' && password.length >= 8;
};

module.exports = {
  isValidEmail,
  isStrongPassword,
};
