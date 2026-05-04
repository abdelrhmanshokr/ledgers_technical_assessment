/**
 * transactionController.js
 * Controller handlers for company transactions.
 */

const { Prisma } = require('@prisma/client');
const prisma = require('../config/db');

/**
 * Create a new transaction
 * POST /api/v1/companies/:companyId/transactions
 */
const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const { companyId } = req.params;
    const userId = req.user.id;

    // 1. Validation
    // Use Decimal precision - amount should ideally be a string from client
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      const error = new Error('Amount must be a positive number');
      error.statusCode = 400;
      throw error;
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      const error = new Error('Type must be either INCOME or EXPENSE');
      error.statusCode = 400;
      throw error;
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      const error = new Error('Category is required');
      error.statusCode = 400;
      throw error;
    }

    // Validate date if provided
    let transactionDate = new Date();
    if (date) {
      transactionDate = new Date(date);
      if (isNaN(transactionDate.getTime())) {
        const error = new Error('Invalid date format');
        error.statusCode = 400;
        throw error;
      }
    }

    // 2. Create Transaction in Database
    const transaction = await prisma.transaction.create({
      data: {
        amount: new Prisma.Decimal(amount), // High precision handling
        type,
        category: category.trim(),
        description,
        date: transactionDate,
        companyId: parseInt(companyId, 10),
        userId,
      },
    });

    // 3. Return Successful Response
    res.status(201).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all transactions for a specific company
 * GET /api/v1/companies/:companyId/transactions
 */
const getTransactions = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { type, startDate, endDate } = req.query;

    // 1. Build Query Filters
    const filters = {
      companyId: parseInt(companyId, 10),
    };

    if (type && ['INCOME', 'EXPENSE'].includes(type)) {
      filters.type = type;
    } 

    // Validate and build date range filters
    if (startDate || endDate) {
      filters.date = {};
      
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          const error = new Error('Invalid startDate format');
          error.statusCode = 400;
          throw error;
        }
        filters.date.gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          const error = new Error('Invalid endDate format');
          error.statusCode = 400;
          throw error;
        }
        filters.date.lte = end;
      }
    }

    // 2. Fetch Transactions from Database
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: {
        date: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // 3. Return Successful Response
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
};
