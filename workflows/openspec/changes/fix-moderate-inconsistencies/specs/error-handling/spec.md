## MODIFIED Requirements

### Requirement: Consistent Error Responses
All API endpoints SHALL return errors in a consistent format with Spanish messages.

#### Scenario: Validation Error
- **WHEN** input validation fails
- **THEN** returns NextResponse with status 400 and Spanish message
- **AND** message format is consistent across endpoints

#### Scenario: Authorization Error
- **WHEN** user lacks permissions
- **THEN** returns NextResponse with status 403 and clear Spanish message
- **AND** same format used everywhere

### Requirement: Standardized Error Handling
Error handling SHALL follow consistent patterns across the application.

#### Scenario: Database Error
- **WHEN** database operation fails
- **THEN** catches error and returns appropriate HTTP status
- **AND** logs error appropriately without exposing sensitive data

#### Scenario: Unexpected Error
- **WHEN** unexpected error occurs
- **THEN** returns 500 status with generic Spanish message
- **AND** error is logged for debugging</content>
<parameter name="filePath">openspec/changes/fix-moderate-inconsistencies/specs/error-handling/spec.md