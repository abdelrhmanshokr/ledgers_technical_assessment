const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const errorHandler = require('../src/middleware/errorMiddleware');
const fs = require('fs');
const path = require('path');

describe('Task T2.2: Implement Signup Logic Verification (Structural & Unit)', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api', routes);
        app.use(errorHandler);
    });

    describe('Controller Logic Analysis', () => {
        test('src/controllers/authController.js should have validation, hashing, and JWT logic', () => {
            const filePath = path.join(__dirname, '../src/controllers/authController.js');
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Requirements verification
            expect(content).toContain('isValidEmail(email)');
            expect(content).toContain('isStrongPassword(password)');
            expect(content).toContain('bcrypt.hash');
            expect(content).toContain('prisma.user.create');
            expect(content).toContain('jwt.sign');
            expect(content).toContain('userId: user.id'); // Payload efficiency check
        });

        test('src/utils/validation.js should have email and password validation', () => {
            const filePath = path.join(__dirname, '../src/utils/validation.js');
            const content = fs.readFileSync(filePath, 'utf8');
            
            expect(content).toContain('isValidEmail');
            expect(content).toContain('isStrongPassword');
        });
    });

    describe('Integration Verification (Request Flow)', () => {
        test('POST /api/v1/auth/signup should return 400 for missing fields', async () => {
            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('required');
        });

        test('POST /api/v1/auth/signup should return 400 for invalid email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send({ email: 'invalid', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('email format');
        });
    });
});
