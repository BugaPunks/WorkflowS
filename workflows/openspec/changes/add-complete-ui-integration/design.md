## 1. Admin User Management UI
- [ ] 1.1 Create UserList component using /api/users/list
- [ ] 1.2 Create UserForm component for creating/editing users (/api/users)
- [ ] 1.3 Create RoleAssignment component using /api/users/[userId]/role
- [ ] 1.4 Update /admin/users page to include full CRUD interface
- [ ] 1.5 Add search and filter functionality for user list

## 2. Sprint CRUD UI Integration
- [ ] 2.1 Create SprintForm component for creating/editing sprints (/api/sprints/[sprintId])
- [ ] 2.2 Integrate sprint CRUD in SprintsTab.tsx
- [ ] 2.3 Add sprint status management (active, completed)
- [ ] 2.4 Connect sprint creation to project context

## 3. User Story CRUD UI Integration
- [ ] 3.1 Create StoryForm component for creating/editing stories (/api/stories/[storyId])
- [ ] 3.2 Create TaskForm component for managing tasks within stories (/api/stories/[storyId]/tasks)
- [ ] 3.3 Integrate story CRUD in BacklogTab.tsx
- [ ] 3.4 Add story priority and status management
- [ ] 3.5 Connect acceptance criteria editing

## 4. User Dashboard and Personal Tasks
- [ ] 4.1 Create UserDashboard component using /api/users/me/tasks
- [ ] 4.2 Add personal task overview on main page for logged-in users
- [ ] 4.3 Integrate notifications display in user dashboard
- [ ] 4.4 Add quick access to assigned projects and tasks

## 5. Fix Evaluation Endpoint Integration
- [ ] 5.1 Update EvaluationForm.tsx to use /api/projects/[projectId]/evaluations instead of /api/evaluations
- [ ] 5.2 Ensure all evaluation components use correct project-scoped endpoints
- [ ] 5.3 Test evaluation submission and display

## 6. Platform Integration and Navigation
- [ ] 6.1 Update project page (/projects/[projectId]) to include all tabs seamlessly
- [ ] 6.2 Add role-based navigation (hide admin features for non-admins)
- [ ] 6.3 Implement breadcrumb navigation across pages
- [ ] 6.4 Add global search functionality
- [ ] 6.5 Ensure responsive design across all new components

## 7. Testing and Validation
- [ ] 7.1 Test all new UI components with API integration
- [ ] 7.2 Run npm run lint and fix any issues
- [ ] 7.3 Run npm run build and ensure no errors
- [ ] 7.4 Test end-to-end user flows (admin user management, sprint creation, story management)</content>
<parameter name="filePath">openspec/changes/add-complete-ui-integration/tasks.md