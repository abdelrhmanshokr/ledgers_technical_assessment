const prisma = require('../src/config/prisma');

describe('Database Schema Verification', () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('should connect to the database', async () => {
        try {
            await prisma.$connect();
            expect(true).toBe(true);
        } catch (error) {
            throw new Error(`Failed to connect to database: ${error.message}`);
        }
    });

    test('should have User table accessible', async () => {
        const users = await prisma.user.findMany();
        expect(Array.isArray(users)).toBe(true);
    });

    test('should have Company table accessible', async () => {
        const companies = await prisma.company.findMany();
        expect(Array.isArray(companies)).toBe(true);
    });

    test('should have CompanyUser table accessible', async () => {
        const companyUsers = await prisma.companyUser.findMany();
        expect(Array.isArray(companyUsers)).toBe(true);
    });

    test('should have Transaction table accessible', async () => {
        const transactions = await prisma.transaction.findMany();
        expect(Array.isArray(transactions)).toBe(true);
    });
});
