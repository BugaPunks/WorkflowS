# Change: Add Complete UI Integration and Missing Endpoints

## Why
While the core WorkflowS features are implemented, several API endpoints lack frontend UI integration, and some functionalities are not fully connected within the platform. The admin user management, complete sprint/story CRUD operations, and user-specific features need UI components to make the platform fully functional. Additionally, the evaluation endpoint has an inconsistency that needs fixing.

## What Changes
- **ADDED**: Complete admin dashboard for user management (CRUD users, role assignment)
- **ADDED**: Full UI for sprint CRUD operations within project pages
- **ADDED**: Full UI for user story CRUD operations in backlog
- **ADDED**: User dashboard showing personal tasks and notifications
- **MODIFIED**: EvaluationForm to use correct project-specific endpoint
- **MODIFIED**: Integrate all features seamlessly in project pages and admin interface
- **ADDED**: Role-based navigation and access control in UI

## Impact
- Affected specs: New capabilities for user-management, admin-dashboard, sprint-management, story-management
- Affected code: New components in src/app/components/, updates to existing pages, new admin pages
- Breaking changes: None - enhancements to existing functionality</content>
<parameter name="filePath">openspec/changes/add-complete-ui-integration/proposal.md