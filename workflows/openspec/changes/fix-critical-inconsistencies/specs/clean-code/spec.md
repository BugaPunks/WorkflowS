## ADDED Requirements

### Requirement: Centralized Authentication Utilities
The system SHALL provide utility functions for common authentication patterns.

#### Scenario: Session Validation
- **WHEN** an API route needs to validate user session
- **THEN** it uses requireAuth() utility function
- **AND** gets consistent error responses

#### Scenario: Role-Based Access Control
- **WHEN** an API route needs role validation
- **THEN** it uses requireRole() or requireAdmin() functions
- **AND** role checks are consistent across the application

### Requirement: Eliminated Code Duplication
Authentication code SHALL not be duplicated across API routes.

#### Scenario: Consistent Auth Patterns
- **WHEN** implementing new API routes
- **THEN** they use the centralized auth utilities
- **AND** follow the same error handling patterns</content>
<parameter name="filePath">openspec/changes/fix-critical-inconsistencies/specs/authentication/spec.md