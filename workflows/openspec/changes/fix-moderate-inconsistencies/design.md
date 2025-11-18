## 1. Unify Role Validation Patterns
- [ ] 1.1 Audit all API endpoints for role validation patterns
- [ ] 1.2 Replace inconsistent patterns with centralized utilities
- [ ] 1.3 Update component role checks to use consistent patterns
- [ ] 1.4 Test that all role validations work correctly

## 2. Standardize Error Handling
- [ ] 2.1 Create consistent error response utility functions
- [ ] 2.2 Audit all API endpoints for error handling patterns
- [ ] 2.3 Replace inconsistent error responses with standardized ones
- [ ] 2.4 Ensure consistent error messages in Spanish

## 3. Update Authentication Patterns
- [ ] 3.1 Replace manual session checks with requireAuth() utility
- [ ] 3.2 Update role-specific endpoints to use requireRole() functions
- [ ] 3.3 Remove duplicated authentication code
- [ ] 3.4 Test authentication flows remain working

## 4. Clean Up Validation Code
- [ ] 4.1 Remove redundant validation checks
- [ ] 4.2 Consolidate similar validation logic
- [ ] 4.3 Add input validation where missing
- [ ] 4.4 Update tests to match new validation patterns

## 5. Testing and Validation
- [ ] 5.1 Run all API tests to ensure no regressions
- [ ] 5.2 Test authentication and authorization flows
- [ ] 5.3 Validate error responses are consistent
- [ ] 5.4 Run npm run lint and fix any issues</content>
<parameter name="filePath">openspec/changes/fix-moderate-inconsistencies/tasks.md