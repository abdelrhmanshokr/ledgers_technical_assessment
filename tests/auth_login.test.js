const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const errorHandler = require('../src/middleware/errorMiddleware');
const fs = require('fs');
const path = require('path');

describe('Task T2.3: Implement Login Logic Verification', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api', routes);
        app.use(errorHandler);
    });

    describe('Controller Logic Analysis', () => {
        test('src/controllers/authController.js should NOT log sensitive data', () => {
            const filePath = path.join(__dirname, '../src/controllers/authController.js');
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Critical check for password logging
            const loginSection = content.substring(content.indexOf('const login ='));
            expect(loginSection).not.toMatch(/console\.log\(.*password.*\)/i);
        });

        test('src/controllers/authController.js should use separate secrets for Access and Refresh tokens', () => {
            const filePath = path.join(__dirname, '../src/controllers/authController.js');
            const content = fs.readFileSync(filePath, 'utf8');
            
            expect(content).toContain('process.env.JWT_SECRET');
            expect(content).toContain('process.env.JWT_REFRESH_SECRET');
        });

        test('src/controllers/authController.js should calculate correct expiration for refresh tokens', () => {
             const filePath = path.join(__dirname, '../src/controllers/authController.js');
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for 7 days in milliseconds
            expect(content).toContain('7 * 24 * 60 * 60 * 1000');
        });
    });

    describe('Integration Verification (Request Flow)', () => {
        test('POST /api/v1/auth/login should return 400 for missing fields', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('required');
        });
    });
});
