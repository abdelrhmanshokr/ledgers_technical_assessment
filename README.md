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
