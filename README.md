# Ledgers — Backend Technical Assessment

## Overview
This is a multi‑company financial ledger system API built with Node.js, Express, and PostgreSQL. It allows users to manage financial transactions across multiple organizations with secure access control.

## Key Features
- **Multi-Company Support**: Users can belong to multiple companies and manage transactions for each.
- **JWT Authentication**: Secure signup and login flows using JSON Web Tokens.
- **Transaction Management**: Record income and expenses with detailed descriptions and dates.
- **Dashboard API**: Aggregate financial data (total revenue/expenses) per company.
- **Access Control**: Strict membership-based access to company data.

## Tech Stack
- **Framework**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Security**: bcryptjs (hashing), jsonwebtoken (auth)
- **Validation**: Dotenv, CORS

## Project Structure
- `src/`: Source code including controllers, routes, and middleware.
- `prisma/`: Database schema and migrations.
- `docs/`: Detailed project plans and progress tracking.

## Getting Started
### Prerequisites
- Node.js (v16+)
- PostgreSQL

### Installation
1. Clone the repository.
2. Run `npm install`.
3. Set up your `.env` file (see `.env.example`).
4. Run `npx prisma migrate dev` to setup the database.
5. Start the server with `npm run dev`.

## Documentation
- [Project Idea](docs/project_main_idea.md)
- [Plan & Progress](docs/plan_and_progress.md)
- [Detailed Task Progress](progress.md)

## Implemented Tasks
### Phase 0: Project Initialisation
- [x] **T0.1**: Initialized Node.js project.
- [x] **T0.2 & T0.3**: Installed production and development dependencies.
- [x] **T0.4**: Setup standard folder structure (`src/controllers`, `src/routes`, etc.).
- [x] **T0.5**: Configured environment variables (`.env`).
- [x] **T0.6**: Initialized Git repository.

### Phase 1: Database Setup
- [x] **T1.1**: Defined Prisma schema with `User`, `Company`, and `Transaction` models.
- [x] **T1.2**: Applied database migrations with financial precision (`Decimal`) and type safety (`Enums`).
- [x] **T1.3**: Implemented Prisma Client singleton with logging and graceful shutdown.

### Phase 2: Authentication
- [x] **T2.1**: Set up routing skeleton with `/api/v1` versioning and global error handling.
- [x] **T2.2**: Implemented secure user signup with `bcryptjs` and `jsonwebtoken`.
- [x] **T2.3**: Implemented login with dual-token system (Access & Refresh tokens).
- [x] **T2.4**: Created robust `authMiddleware.js` with database-level user verification and context enrichment.
- [x] **T2.5**: Verified authentication endpoints and middleware functionality.

### Phase 3: Company Management
- [x] **T3.1**: Set up company management infrastructure and routes protected by authentication.
- [x] **T3.2**: Implemented atomic company creation with Prisma transactions and role-based owner association.
- [x] **T3.3**: Implemented list and detail views for companies with membership roles.
- [x] **T3.4 & T3.5**: Developed `checkCompanyAccess` middleware for RBAC and implemented user invitation logic for Owners.

### Phase 4: Transactions API
- [x] **T4.1 & T4.2**: Created secure transaction infrastructure restricted by both user authentication and company membership.
- [x] **T4.3 & T4.5**: Implemented income/expense recording with strict validation and decimal precision.
- [x] **T4.4**: Developed transaction history endpoint with advanced filtering by type and date ranges.

### Phase 5: Dashboard Endpoint
- [x] **T5.1 - T5.4**: Implemented financial dashboard analytics providing total income, expenses, and net balance using optimized database aggregations.

### Phase 6: Error Handling & Validation
- [x] **T6.1 - T6.3**: Standardized API responses with a global error handler and implemented robust input validation across all endpoints.

### Phase 7: Redis & Idempotency Key Addition
- [x] **T7.1 - T7.5**: Implemented robust header-based request idempotency using Redis and PostgreSQL. Features include atomic `SET NX` locks for concurrency, transaction-aware response caching, and database-level unique enforcement.

### Phase 8: Documentation & Final Prep
- [ ] **T8.1**: Finalizing README and submission - *Next*
