## MODIFIED Requirements

### Requirement: Singleton Prisma Client Usage
All database operations SHALL use the singleton Prisma client instance from src/lib/prisma.ts.

#### Scenario: API Route Database Access
- **WHEN** an API route needs database access
- **THEN** it imports prisma from @/lib/prisma
- **AND** does not create new PrismaClient instances

#### Scenario: Consistent Connection Management
- **WHEN** multiple API routes are called
- **THEN** they share the same database connection pool
- **AND** connection limits are respected</content>
<parameter name="filePath">openspec/changes/fix-critical-inconsistencies/specs/prisma-client/spec.md