/**
 * companyController.js
 * Controller handlers for company-related routes.
 */

const { Prisma } = require('@prisma/client');
const prisma = require('../config/db');

/**
 * Handle company creation
 * POST /api/v1/companies
 * Uses an atomic transaction to create company and assign owner.
 */
const createCompany = async (req, res, next) => {
  try {
    const { name, userId } = req.body;

    // 1. Validate input
    if (!name) {
      const error = new Error('Company name is required');
      error.statusCode = 400;
      throw error;
    }

    // 2. Atomic Transaction to create Company and CompanyUser record
    const result = await prisma.$transaction(async (tx) => {
      // Create the company
      const company = await tx.company.create({
        data: {
          name,
        },
      });

      // 3. Create the association with the creating user as OWNER (Optional based on userId)
      if (userId) {
        // check if user exists before creating association
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          const error = new Error('User not found for association');
          error.statusCode = 404;
          throw error;
        }

        await tx.companyUser.create({
          data: {
            userId: userId,
            companyId: company.id,
            role: 'MEMBER',
          },
        });
      }else {
        /**
         * create the company using the company name
         * and req.user.id as the owner of the company
         * this is optional based on the userId in the request body
         * if userId is not provided, the company will be created without an owner
         * and the association will not be created
         * this allows for flexibility in how companies are created and associated with users
         * it also allows for future functionality where companies can exist without an owner or be associated with multiple users in different roles
         * the company can be created first and then associated with users later using the createCompanyUser endpoint
         * this is a design choice to allow for more flexible company creation and user association workflows in the future
         * it also simplifies the initial company creation process by not requiring an immediate association with a user if not desired
         * the company can be created and then associated with users as needed using the createCompanyUser endpoint which handles user associations separately from company creation
         * this separation of concerns allows for clearer API design and more modular functionality in the future as the application evolves
         */
        await tx.companyUser.create({
          data: {
            userId: req.user.id,
            companyId: company.id,
            role: 'MEMBER',
          },
        });
      }

      return company;
    });

    // 3. Return successful response
    res.status(201).json({
      status: 'success',
      data: {
        company: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user assosiation with an existing company
 * POST /api/v1/companies/users
 */
const createCompanyUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { companyId } = req.params;

    // 1. Validate input
    if (!companyId) {
      const error = new Error('Company ID and User ID are required');
      error.statusCode = 400;
      throw error;
    }

    // 2. Additional validation to check if company and user exist can be added here for robustness.
    const cid = parseInt(companyId, 10);
    const company = await prisma.company.findUnique({
      where: { id: cid },
    });
    if (!company) {
      const error = new Error('Company not found');
      error.statusCode = 404;
      throw error;
    }

    // 2.1 Check if user-company association already exists
    const existingAssociation = await prisma.companyUser.findUnique({
      where: {
        userId_companyId: {
          userId: userId || req.user.id,
          companyId: cid,
        },
      },
    });

    if (existingAssociation) {
      const error = new Error('User is already a member of this company');
      error.statusCode = 409;
      throw error;
    }

    // 3. Create the association with the user as MEMBER
    if (userId) {
      // check if user exists before creating association
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        const error = new Error('User not found for association');
        error.statusCode = 404;
        throw error;
      }

      const result = await prisma.companyUser.create({
        data: {
          userId,
          companyId: cid,
          role: 'MEMBER',
        },
      });

      // 3. Return successful response
      res.status(201).json({
        status: 'success',
        data: {
          companyUser: result,
        },
      });
    } else {
      const result = await prisma.companyUser.create({
        data: {
          userId: req.user.id,
          companyId: cid,
          role: 'MEMBER',
        },
      });

      // 3. Return successful response
      res.status(201).json({
        status: 'success',
        data: {
          companyUser: result,
        },
      });
    }
    
  } catch (error) {
    next(error);
  }
};

/**
 * Handle listing user's companies
 * GET /api/v1/companies
 */
const getCompanies = async (req, res, next) => {
  try {
    // 1. Fetch all companies where the user is a member
    const companies = await prisma.companyUser.findMany({
      where: { userId: req.user.id },
      include: {
        company: true,
      },
    });

    // 2. Return the list of companies
    res.status(200).json({
      status: 'success',
      data: {
        companies: companies.map((cu) => ({
          id: cu.company.id,
          name: cu.company.name,
          role: cu.role,
          joinedAt: cu.joinedAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle getting company details by ID
 * GET /api/v1/companies/:id
 */
const getCompanyById = async (req, res, next) => {
  try {
    // getCompanyById relies on checkCompanyAccess middleware, 
    // which has already fetched and attached the company and role to the request.
    res.status(200).json({
      status: 'success',
      data: {
        company: req.company,
        role: req.companyRole,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get company dashboard data
 * GET /api/v1/companies/:companyId/dashboard
 */
const getCompanyDashboard = async (req, res, next) => {
  try {
    // 1. Utilize middleware context (cid handled by checkCompanyAccess via req.company)
    const companyId = req.company.id;
    const { startDate, endDate } = req.query;

    // 2. Build date filters (Validation handled by schema)
    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // 3. Aggregate INCOME & EXPENSE with High Precision
    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { 
          companyId, 
          type: 'INCOME',
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        }
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { 
          companyId, 
          type: 'EXPENSE',
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        }
      })
    ]);

    const totalIncome = income._sum.amount || new Prisma.Decimal(0);
    const totalExpense = expense._sum.amount || new Prisma.Decimal(0);
    const netBalance = totalIncome.minus(totalExpense);

    // 4. Return as Strings to avoid precision loss on client side
    res.status(200).json({
      status: 'success',
      data: {
        companyId,
        summary: {
          totalIncome: totalIncome.toString(),
          totalExpense: totalExpense.toString(),
          netBalance: netBalance.toString(),
        },
        currency: 'USD',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  createCompanyUser,
  getCompanies,
  getCompanyById,
  getCompanyDashboard
};
