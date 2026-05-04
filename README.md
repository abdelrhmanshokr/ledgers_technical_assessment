# Ledgers Technical Assessment - Backend API

This repository contains a financial management system designed with Node.js, Express, and Prisma. The application allows users to manage multiple companies, record income and expenses with high precision, and view aggregated dashboards.

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Redis server (required for the idempotency layer)

### Installation Steps
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Create a .env file in the root directory based on the following template:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ledgers_db"
   JWT_SECRET="your_access_token_secret"
   JWT_REFRESH_SECRET="your_refresh_token_secret"
   REDIS_URL="redis://localhost:6379"
   PORT=5000
   NODE_ENV=development
   ```

3. Initialize the database schema and generate the Prisma client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. Launch the application:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run start
   ```

## Architecture and Design Decisions

### Financial Precision
To prevent rounding issues common with floating-point math in JavaScript, all monetary values are handled using the Decimal type via Prisma. Amounts are stored in the database with two-decimal precision and served as strings to the client to ensure data integrity during transmission.

### Idempotency Mechanism
The Transactions API implements an idempotency layer using Redis. By providing a unique 'Idempotency-Key' in the request header, clients can safely retry failed network requests. The server will detect if a request has already been processed and return the original successful response without creating duplicate records.

### Role-Based Access Control (RBAC)
Security is implemented using a junction table (CompanyUser) that links users to companies with specific roles. A centralized middleware validates every request to ensure the authenticated user has the necessary permissions to access or modify a company's financial data.

### Stateless Authentication
The system uses JWT for authentication with a dual-token strategy. Short-lived access tokens handle authorization, while longer-lived refresh tokens allow for secure session persistence without storing state on the server.

## API Summary

### Authentication
- POST /api/v1/auth/signup - Create a new user account.
- POST /api/v1/auth/login - Authenticate and receive tokens.

### Company Management
- GET /api/v1/companies - List all companies where the user is a member.
- POST /api/v1/companies - Register a new company.
- POST /api/v1/companies/:companyId/users - Add a member to a company.

### Transactions
- POST /api/v1/companies/:companyId/transactions - Record a new income or expense. Requires 'Idempotency-Key' header.
- GET /api/v1/companies/:companyId/transactions - List all transactions with support for type and date filtering.

### Dashboard
- GET /api/v1/companies/:companyId/dashboard - View a summary of total income, expenses, and current balance. Supports date range filtering.

## Error Handling
The API returns standardized JSON responses for all errors. Validation errors are handled via express-validator middleware, while unexpected exceptions are caught by a global error handler that hides internal stack traces in production environments.
