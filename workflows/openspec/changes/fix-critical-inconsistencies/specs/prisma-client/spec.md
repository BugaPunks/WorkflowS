## Context
The platform has accumulated technical debt with inconsistent patterns that affect performance and maintainability. This change addresses the most critical issues while maintaining backward compatibility.

## Goals / Non-Goals
- **Goals**: Fix critical inconsistencies, improve code quality, maintain functionality
- **Non-Goals**: Add new features, change public APIs, modify business logic

## Decisions
- **Prisma Client**: Use singleton pattern from src/lib/prisma.ts for all database operations
- **Authentication**: Create utility functions for common auth patterns
- **Error Handling**: Remove console statements, use proper error responses
- **Type Imports**: Standardize on @/types for custom types, direct imports for Prisma types
- **Directory Structure**: Maintain clean src/ structure, remove duplicates

## Risks / Trade-offs
- **Testing**: Large refactoring may introduce bugs → Mitigation: Run full test suite after each change
- **Performance**: Prisma client changes may affect connection pooling → Mitigation: Test with multiple concurrent requests
- **Downtime**: Directory removal may break builds → Mitigation: Verify all references before removal

## Migration Plan
1. Remove duplicate directories
2. Fix Prisma usage incrementally
3. Add auth utilities
4. Clean up console statements
5. Standardize imports
6. Full testing and validation</content>
<parameter name="filePath">openspec/changes/fix-critical-inconsistencies/design.md