# Project Context

## Purpose
WorkflowS is a web platform for agile management of academic projects. It enables students, teachers, and project managers to collaborate on projects using Scrum methodology, with features for sprint planning, user story management, task tracking, evaluations, and document management.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** TailwindCSS
- **Database:** Prisma ORM with SQLite (development), PostgreSQL (production assumed)
- **Authentication:** NextAuth.js with Prisma adapter
- **UI Components:** Custom components with drag-and-drop (@dnd-kit), calendar (react-big-calendar), charts (recharts)
- **Testing:** Jest with Testing Library
- **Linting:** ESLint (Next.js core web vitals)
- **Build:** Next.js build system

## Project Conventions

### Code Style
- Use TypeScript for all new code
- Follow Next.js App Router conventions for file-based routing
- Component naming: PascalCase for React components
- API routes: RESTful conventions with dynamic segments
- No comments in code unless explicitly requested
- Mimic existing code patterns and imports
- Use absolute imports with @/ prefix for src directory

### UI Conventions
- All user interface text and labels MUST be in Spanish
- Use consistent Spanish terminology for Scrum concepts (e.g., "Historia de Usuario", "Sprint", "Tablero Kanban")
- Maintain professional and academic tone in Spanish text
- Ensure proper Spanish grammar and accents in all UI strings

### Architecture Patterns
- **Frontend:** Server and client components in Next.js App Router
- **API:** Route handlers in src/app/api/ for CRUD operations
- **Database:** Prisma schema with relations, enums for status/roles
- **Authentication:** NextAuth session-based auth with role-based access
- **State Management:** React state with server-side data fetching
- **Components:** Reusable UI components in src/app/components/

### Testing Strategy
- Unit and integration tests using Jest and Testing Library
- API route testing with supertest
- Test files in tests/ directory mirroring src structure
- Run tests with `npm test`
- Focus on component behavior and API responses

### Git Workflow
- Feature branches for new development
- Commit messages: imperative mood, concise descriptions
- No direct commits to main branch
- Pull requests for code review

## Domain Context
- **Academic Scrum:** Adapted Scrum for educational projects with teacher oversight
- **Roles:** ADMIN (system admin), DOCENTE (teacher/instructor), ESTUDIANTE (student)
- **Scrum Roles:** SCRUM_MASTER, PRODUCT_OWNER, TEAM_DEVELOPER per project
- **Entities:** Projects contain Sprints, User Stories, Tasks; Evaluations by teachers; Documents and Comments attached to tasks
- **Workflow:** Plan sprints, create user stories with acceptance criteria, break into tasks, assign to students, track progress, evaluate performance

## Important Constraints
- Academic environment: Teacher-student dynamics with evaluation system
- SQLite for development, ensure compatibility with production database
- Role-based permissions: Students limited to assigned tasks, teachers can evaluate
- No external APIs integrated currently

## External Dependencies
- None currently; self-contained application
