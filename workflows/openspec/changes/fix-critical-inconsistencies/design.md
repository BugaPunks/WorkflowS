## 1. Remove Duplicate Directory Structure
- [ ] 1.1 Identify all files in src/srcs/ that are duplicates
- [ ] 1.2 Compare with files in src/ to ensure no unique content is lost
- [ ] 1.3 Remove src/srcs/ directory completely
- [ ] 1.4 Update any references if they exist

## 2. Fix Prisma Client Usage
- [ ] 2.1 Create list of all files using new PrismaClient()
- [ ] 2.2 Replace all new PrismaClient() with import from @/lib/prisma
- [ ] 2.3 Remove unnecessary PrismaClient imports
- [ ] 2.4 Test that all endpoints still work

## 3. Create Centralized Authentication Utility
- [ ] 3.1 Create src/lib/auth-utils.ts with session validation functions
- [ ] 3.2 Implement requireAuth, requireRole, requireAdmin functions
- [ ] 3.3 Update all API routes to use the utility functions
- [ ] 3.4 Remove duplicated authentication code

## 4. Remove Console Statements
- [ ] 4.1 Find all console.log/error statements in src/
- [ ] 4.2 Replace with proper error handling or remove entirely
- [ ] 4.3 Ensure error responses are still returned to clients
- [ ] 4.4 Test that error handling still works

## 5. Standardize Type Imports
- [ ] 5.1 Audit all type imports across the codebase
- [ ] 5.2 Standardize to use @/types for custom types
- [ ] 5.3 Remove unnecessary imports from @prisma/client
- [ ] 5.4 Update any inconsistent type usage

## 6. Testing and Validation
- [ ] 6.1 Run all tests to ensure no regressions
- [ ] 6.2 Test all API endpoints manually
- [ ] 6.3 Run npm run lint and fix any new issues
- [ ] 6.4 Run npm run build and ensure success</content>
<parameter name="filePath">openspec/changes/fix-critical-inconsistencies/tasks.md