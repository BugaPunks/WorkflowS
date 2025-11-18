# Change: Fix Critical Architecture Inconsistencies

## Why
The codebase has critical inconsistencies that affect maintainability, performance, and code quality: duplicate directory structure, inconsistent Prisma client usage, and duplicated authentication code. These issues can cause connection problems, memory leaks, and maintenance difficulties.

## What Changes
- **REMOVED**: Duplicate `src/srcs/` directory structure
- **MODIFIED**: All API routes to use singleton Prisma client from `src/lib/prisma.ts`
- **ADDED**: Centralized authentication utility function
- **MODIFIED**: Remove all `console.log/error` statements from production code
- **MODIFIED**: Standardize type imports across the codebase

## Impact
- Affected specs: All API endpoints and components
- Affected code: 40+ API routes, prisma client usage, authentication patterns
- Breaking changes: None - internal refactoring only</content>
<parameter name="filePath">openspec/changes/fix-critical-inconsistencies/proposal.md