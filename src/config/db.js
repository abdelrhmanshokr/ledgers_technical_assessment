/**
 * src/config/db.js
 * Database configuration and Prisma Client singleton initialization.
 * 
 * In Prisma 7, the connection string is managed via prisma.config.ts,
 * so we initialize the client here to be used throughout the app.
 */

const { PrismaClient } = require('@prisma/client');

/**
 * We create a single instance of PrismaClient to ensure we don't
 * exhaust database connection limits during development and production.
 * 
 * We use a global variable to prevent multiple instances during development 
 * hot-reloads.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
};

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

module.exports = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
