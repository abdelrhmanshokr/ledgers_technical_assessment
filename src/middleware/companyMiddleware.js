/**
 * companyMiddleware.js
 * Middleware to authorize requests based on company membership and roles.
 */

const prisma = require('../config/db');

/**
 * checkCompanyAccess middleware
 * Extracts companyId from params and verifies if the user has access.
 */
const checkCompanyAccess = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const userId = req.user.id;

      if (!companyId) {
        const error = new Error('Company ID is required for access check');
        error.statusCode = 400;
        return next(error);
      }

      // 1. Verify if a CompanyUser record exists for this user and company
      const association = await prisma.companyUser.findUnique({
        where: {
          userId_companyId: {
            userId,
            companyId: parseInt(companyId, 10),
          },
        },
        include: {
          company: true,
        },
      });

      // 2. Return 403 Forbidden if the user is not a member
      if (!association) {
        const error = new Error('Forbidden: You do not have access to this company');
        error.statusCode = 403;
        return next(error);
      }

      // 3. Optionally check for a specific role (e.g., OWNER)
      if (requiredRole && association.role !== requiredRole) {
        const error = new Error(`Forbidden: This operation requires ${requiredRole} role`);
        error.statusCode = 403;
        return next(error);
      }

      // 4. Attach company and role to req object for use in controllers
      req.company = association.company;
      req.companyRole = association.role;

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  checkCompanyAccess,
};
