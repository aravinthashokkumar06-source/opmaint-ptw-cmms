# Backend Layer Architecture

* `src/backend/db/`: Prisma Client singleton & database access layer.
* `src/backend/types/`: Strict TypeScript domain interfaces for permits, users, and type-specific polymorphic data.
* `src/backend/services/`: Pure business logic (Permit Lifecycle State Machine, Conflict Detection, Expiry Handler).
* `src/backend/middleware/`: Role-Based Access Control (RBAC) and Auth session verification.
