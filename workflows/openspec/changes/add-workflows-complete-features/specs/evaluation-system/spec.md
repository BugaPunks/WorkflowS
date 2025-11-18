## Context
This change implements the remaining features for WorkflowS, a complete academic project management platform. The system needs to support evaluation workflows, progress tracking, communication, and document management while maintaining role-based access control.

## Goals / Non-Goals
- **Goals**: Complete the platform per Instrucciones.md specification, enable full Scrum workflow for academic projects, provide teachers with evaluation tools, ensure intuitive UI
- **Non-Goals**: Real-time collaboration features, external integrations (Google Calendar export mentioned but not implemented), advanced analytics beyond burndown/contribution

## Decisions
- **Database**: Extend existing Prisma schema with new models (Evaluation, Notification, Document, Comment) maintaining SQLite compatibility
- **Authentication**: Continue using NextAuth with role-based permissions (ADMIN, DOCENTE, ESTUDIANTE)
- **File Storage**: Local file system for documents (simple, no cloud storage complexity)
- **Charts**: Use recharts library (already in dependencies) for burndown and contribution charts
- **Calendar**: Use react-big-calendar (already in dependencies) for event display
- **Notifications**: Database-driven with polling (no WebSockets for simplicity)
- **Export**: JSON/CSV format for portability

## Risks / Trade-offs
- **File Upload Complexity**: Local storage is simple but not scalable → Mitigation: Document migration path to cloud storage in future
- **Performance**: Multiple new API calls on project pages → Mitigation: Implement pagination and caching where needed
- **UI Consistency**: Many new components → Mitigation: Follow existing component patterns and TailwindCSS conventions

## Migration Plan
- Database: Run Prisma migration to add new tables
- Code: Add new API routes and components incrementally
- Rollback: Drop new tables if needed (no data loss for existing features)

## Open Questions
- Should notifications be email-based or only in-app?
- File size limits for document uploads?
- Should calendar allow creating custom events beyond sprints?</content>
<parameter name="filePath">openspec/changes/add-workflows-complete-features/design.md