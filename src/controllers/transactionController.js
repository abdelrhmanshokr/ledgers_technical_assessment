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

    // Validation is now handled by validateRequest middleware and createTransactionSchema

    // Use current date if not provided (validateRequest ensures formatting if provided)
    let transactionDate = date ? new Date(date) : new Date();

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

    // 1. Build Query Filters (Validation handled by getTransactionsFiltersSchema)
    const filters = {
      companyId: parseInt(companyId, 10),
    };

    if (type) {
      filters.type = type;
    }

    // Date range filters
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.gte = new Date(startDate);
      if (endDate) filters.date.lte = new Date(endDate);    }

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
