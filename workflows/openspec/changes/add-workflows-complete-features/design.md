## 1. Database Schema Updates
- [ ] 1.1 Add Evaluation model (score, feedback, project, sprint, student, evaluator)
- [ ] 1.2 Add Notification model (message, read, link, user)
- [ ] 1.3 Add Document model (filename, url, filetype, version, project, task, uploadedBy)
- [ ] 1.4 Add Comment model (text, task, author)
- [ ] 1.5 Run Prisma migration for new models

## 2. Evaluation System Implementation
- [ ] 2.1 Create API routes for evaluations (POST /api/projects/[projectId]/evaluations, GET /api/sprints/[sprintId]/evaluations)
- [ ] 2.2 Create EvaluationForm component for teachers to submit evaluations
- [ ] 2.3 Create EvaluationsTab component to display evaluation history
- [ ] 2.4 Add evaluation permissions (only DOCENTE can evaluate)

## 3. Metrics and Reports Implementation
- [ ] 3.1 Create API routes for burndown data (GET /api/sprints/[sprintId]/burndown)
- [ ] 3.2 Create API routes for contribution reports (GET /api/sprints/[sprintId]/contribution)
- [ ] 3.3 Create BurndownChart component using recharts
- [ ] 3.4 Create ContributionReport component
- [ ] 3.5 Create ReportsTab component aggregating metrics

## 4. Notifications System Implementation
- [ ] 4.1 Create API routes for notifications (GET /api/notifications, PUT /api/notifications/[id]/read)
- [ ] 4.2 Create NotificationsBell component for header
- [ ] 4.3 Implement notification triggers (task assignment, evaluation submission, sprint deadlines)
- [ ] 4.4 Add real-time updates (optional, start with polling)

## 5. Document Management Implementation
- [ ] 5.1 Create API routes for documents (POST /api/projects/[projectId]/documents, GET /api/documents/[documentId])
- [ ] 5.2 Implement file upload handling (use Next.js API with file storage)
- [ ] 5.3 Create DocumentsTab component with upload/download functionality
- [ ] 5.4 Add document associations to tasks and projects

## 6. Communication System Implementation
- [ ] 6.1 Create API routes for comments (POST /api/tasks/[taskId]/comments, GET /api/tasks/[taskId]/comments)
- [ ] 6.2 Create TaskDetailsModal with comments section
- [ ] 6.3 Add comment permissions (assigned users and project members)

## 7. Calendar Integration Implementation
- [ ] 7.1 Create API routes for calendar events (GET /api/projects/[projectId]/events)
- [ ] 7.2 Create CalendarTab component using react-big-calendar
- [ ] 7.3 Integrate sprint dates and deadlines as calendar events

## 8. Data Export Implementation
- [ ] 8.1 Create API routes for export (GET /api/projects/[projectId]/export)
- [ ] 8.2 Implement CSV/JSON export for projects, sprints, tasks, evaluations
- [ ] 8.3 Add export button to project pages

## 9. Dashboard and UI Updates
- [ ] 9.1 Create role-based dashboard views (admin, docente, estudiante)
- [ ] 9.2 Update project board page with complete tabs (Backlog, Sprints, Kanban, etc.)
- [ ] 9.3 Ensure responsive design across all new components

## 10. Testing and Validation
- [ ] 10.1 Write API tests for all new endpoints
- [ ] 10.2 Write component tests for new UI elements
- [ ] 10.3 Run npm run lint and fix any issues
- [ ] 10.4 Run npm run build and ensure no errors
- [ ] 10.5 Test end-to-end workflows (create project, assign tasks, evaluate, export)</content>
<parameter name="filePath">openspec/changes/add-workflows-complete-features/tasks.md