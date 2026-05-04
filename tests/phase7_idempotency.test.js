const request = require('supertest');
const express = require('express');

// Mock helpers for Redis
const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    on: jest.fn()
};

// Use factory for mocking to avoid hoisting issues
jest.mock('../src/config/redis', () => {
    return {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        on: jest.fn()
    };
});

const redis = require('../src/config/redis');

// Mock Auth & Company
jest.mock('../src/middleware/authMiddleware', () => ({
    protect: (req, res, next) => { req.user = { id: 1 }; next(); }
}));
jest.mock('../src/middleware/companyMiddleware', () => ({
    checkCompanyAccess: () => (req, res, next) => next()
}));

// Mock Database
jest.mock('../src/config/db', () => ({
    transaction: { create: jest.fn() },
    companyUser: { findUnique: jest.fn() }
}));

const routes = require('../src/routes');
const errorHandler = require('../src/middleware/errorMiddleware');
const prisma = require('../src/config/db');

describe('Phase 7: Redis & Idempotency Verification', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api', routes);
        app.use(errorHandler);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('New Key: Should set PROCESSING and allow request', async () => {
        redis.set.mockResolvedValue('OK'); // NX check success
        prisma.transaction.create.mockResolvedValue({ id: 99 });

        const response = await request(app)
            .post('/api/v1/companies/1/transactions')
            .set('Idempotency-Key', 'unique-key-1')
            .send({ amount: 100, type: 'INCOME', category: 'Test' });

        expect(response.status).toBe(201);
        expect(redis.set).toHaveBeenCalledWith(
            expect.stringContaining('unique-key-1'), 
            'PROCESSING', 'NX', 'EX', 60
        );
        // Check that final result is saved
        expect(redis.set).toHaveBeenCalledWith(
            expect.stringContaining('unique-key-1'), 
            expect.stringContaining('success'), 'EX', 86400
        );
    });

    test('Duplicate Key (Processing): Should return 409', async () => {
        redis.set.mockResolvedValue(null); // NX check fails
        redis.get.mockResolvedValue('PROCESSING');

        const response = await request(app)
            .post('/api/v1/companies/1/transactions')
            .set('Idempotency-Key', 'same-key')
            .send({ amount: 100, type: 'INCOME', category: 'Test' });

        expect(response.status).toBe(409);
        expect(response.body.message).toContain('currently being processed');
    });

    test('Duplicate Key (Completed): Should return cached response', async () => {
        redis.set.mockResolvedValue(null); // NX check fails
        const cachedBody = { status: 'success', data: { id: 99 } };
        redis.get.mockResolvedValue(JSON.stringify({ status: 201, body: cachedBody }));

        const response = await request(app)
            .post('/api/v1/companies/1/transactions')
            .set('Idempotency-Key', 'completed-key')
            .send({ amount: 100, type: 'INCOME', category: 'Test' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(cachedBody);
        expect(prisma.transaction.create).not.toHaveBeenCalled();
    });

    test('Server Error: Should delete PROCESSING key to allow retry', async () => {
        redis.set.mockResolvedValue('OK'); // NX success
        prisma.transaction.create.mockImplementation(() => { throw new Error('DB Down'); });

        const response = await request(app)
            .post('/api/v1/companies/1/transactions')
            .set('Idempotency-Key', 'retry-key')
            .send({ amount: 100, type: 'INCOME', category: 'Test' });

        expect(response.status).toBe(500);
        expect(redis.del).toHaveBeenCalledWith(expect.stringContaining('retry-key'));
    });
});
