/**
 * src/config/db.js
 * Database configuration and Prisma Client singleton initialization.
 * 
 * In Prisma 7, the connection string is managed via prisma.config.ts,
 * so we initialize the client here to be used throughout the app.
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

/**
 * We create a single instance of PrismaClient to ensure we don't
 * exhaust database connection limits during development and production.
 * 
 * In Prisma 7, we use the @prisma/adapter-pg to connect to PostgreSQL.
 */
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
};

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

module.exports = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
