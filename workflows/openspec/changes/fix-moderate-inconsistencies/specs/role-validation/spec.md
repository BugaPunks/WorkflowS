## Context
After fixing critical inconsistencies, moderate issues in role validation and error handling patterns need standardization to improve code maintainability and API consistency.

## Goals / Non-Goals
- **Goals**: Standardize authentication patterns, unify error responses, improve code consistency
- **Non-Goals**: Add new features, change business logic, modify existing functionality

## Decisions
- **Role Validation**: Use centralized utilities (requireAuth, requireRole, requireAdmin, requireDocente)
- **Error Handling**: Consistent NextResponse patterns with Spanish messages
- **Authentication**: Replace manual session checks with utility functions
- **Validation**: Consolidate input validation logic

## Risks / Trade-offs
- **Testing**: Changes to auth patterns may break existing tests → Mitigation: Update tests accordingly
- **API Compatibility**: Ensure error response formats remain backward compatible → Mitigation: Maintain same HTTP status codes
- **Performance**: Additional function calls in auth utilities → Mitigation: Minimal overhead, benefits outweigh costs

## Migration Plan
1. Update authentication utilities to handle all common patterns
2. Gradually replace manual auth checks with utilities
3. Standardize error responses across endpoints
4. Update and test incrementally</content>
<parameter name="filePath">openspec/changes/fix-moderate-inconsistencies/design.md