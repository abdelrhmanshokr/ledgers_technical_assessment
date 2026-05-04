const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const errorHandler = require('../src/middleware/errorMiddleware');

describe('Task T2.1: Auth Routes Skeleton Verification', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api', routes);
        
        // Add a test error route BEFORE the global error handler
        app.get('/api/v1/test-error', (req, res, next) => {
            const err = new Error('Test Error');
            err.statusCode = 400;
            next(err);
        });

        app.use(errorHandler);
    });
    
    test('POST /api/v1/auth/signup should return 201 Created and placeholder message', async () => {
        const response = await request(app).post('/api/v1/auth/signup').send({});
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Signup placeholder');
    });

    test('POST /api/v1/auth/login should return 200 OK and placeholder message', async () => {
        const response = await request(app).post('/api/v1/auth/login').send({});
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login placeholder');
    });

    test('Non-existent route should trigger 404', async () => {
        const response = await request(app).get('/api/v1/non-existent');
        expect(response.status).toBe(404);
    });

    test('Global error handler should return consistent JSON format on simulated error', async () => {
        const response = await request(app).get('/api/v1/test-error');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Test Error');
    });
});
