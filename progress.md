# Project Progress

## Completed Tasks
| Task ID | Description | Completed On | Notes |
|---------|-------------|--------------|-------|
| T0.1 | Create a new Node.js project | 2026-05-03 | Initialized with npm init -y |
| T0.2 | Install dependencies | 2026-05-03 | Production and dev deps installed |
| T0.3 | Install dev dependencies | 2026-05-03 | Installed nodemon and jest |
| T0.4 | Setup folder structure | 2026-05-04 | Created src/ directories and server.js |
| T0.5 | Setup environment variables | 2026-05-04 | Created .env and .env.example |
| T0.6 | Initialise Git repository | 2026-05-04 | Initialized git and made initial commit |
| T1.1 | Initialize Prisma and write SQL schema | 2026-05-04 | Setup schema.prisma with relations |
| T1.2 | Run schema migrations | 2026-05-04 | Applied migrations with Decimal & Enums |

## Pending Tasks
### Phase 0: Project Initialisation
- ~~T0.1: Create a new Node.js project (`npm init -y`)~~
- ~~T0.2: Install dependencies: `express`, `jsonwebtoken`, `bcryptjs`, `pg`, `dotenv`, `cors`, `prisma`, `@prisma/client`~~
- ~~T0.3: Install dev dependencies: `nodemon`, `jest`~~
- ~~T0.4: Setup folder structure (src/, config/, controllers/, middleware/, models/, routes/, utils/)~~
- ~~T0.5: Setup environment variables (`.env`)~~
- ~~T0.6: Initialise Git repository and create initial commit~~

### Phase 1: Database Setup (PostgreSQL)
- ~~T1.1: Initialize Prisma and write SQL schema:~~
```prisma
enum TransactionType {
  INCOME
  EXPENSE
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  companies     CompanyUser[]
  transactions  Transaction[]
}

model Company {
  id            Int       @id @default(autoincrement())
  name          String
  createdAt     DateTime  @default(now())
  users         CompanyUser[]
  transactions  Transaction[]
}

model CompanyUser {
  userId      Int
  companyId   Int
  joinedAt    DateTime  @default(now())

  user        User     @relation(fields: [userId], references: [id])
  company     Company  @relation(fields: [companyId], references: [id])

  @@id([userId, companyId])
}

model Transaction {
  id          Int             @id @default(autoincrement())
  amount      Decimal         @db.Decimal(15, 2)
  type        TransactionType
  description String?
  date        DateTime
  createdAt   DateTime        @default(now())
  companyId   Int
  userId      Int
  user        User            @relation(fields: [userId], references: [id])
  company     Company         @relation(fields: [companyId], references: [id])

  @@index([companyId])
  @@index([userId])
}
```
- ~~T1.2: Run schema migrations (improved with precision & enums)~~
- T1.3: Create DB connection pool / Prisma client singleton

### Phase 2: Authentication (Signup & Login)
- T2.1: Create `auth` routes: `POST /auth/signup`, `POST /auth/login`
- T2.2: Implement signup (bcrypt, JWT)
- T2.3: Implement login (verify, JWT tokens)
- T2.4: Create `authMiddleware.js`
- T2.5: Test endpoints

### Phase 3: Company Management (Multi‑Company Setup)
- T3.1: Create `company` routes: `POST /companies`, `GET /companies`
- T3.2: Implement `POST /companies` with automatic association
- T3.3: Implement `GET /companies`
- T3.4: Add `checkCompanyAccess` middleware
- T3.5: Add `POST /companies/:companyId/users` endpoint

### Phase 4: Transactions API
- T4.1: Create transaction routes: `POST /companies/:companyId/transactions`, `GET /companies/:companyId/transactions`
- T4.2: Apply access middlewares
- T4.3: Implement `POST` transaction
- T4.4: Implement `GET` transactions with filtering
- T4.5: Validate input

### Phase 5: Dashboard Endpoint
- T5.1: Create route: `GET /dashboard?companyId=XYZ`
- T5.2: Verify company access
- T5.3: Query revenue and expenses
- T5.4: Return dashboard JSON

### Phase 6: Error Handling & Validation
- T6.1: Add global error handler middleware
- T6.2: Add request validation (manual or express-validator)
- T6.3: Standardize error response format

### Phase 7: Security & Cleanup
- T7.1: Protect all sensitive routes
- T7.2: Add rate limiting
- T7.3: Sanitize inputs

### Phase 8: Documentation (README)
- T8.1: Write "How to run" instructions
- T8.2: Document key design decisions

### Phase 9: Testing
- T9.1: Write smoke tests with Jest + Supertest
- T9.2: Test failure cases

### Phase 10: Final Submission Prep
- T10.1: Push final code to GitHub
- T10.2: Record Loom walkthrough
- T10.3: Submit links

## Failed / Blocked Tasks
- (none)

## Current Focus
- Task T1.3 (Create DB connection pool / Prisma client singleton) – in progress
