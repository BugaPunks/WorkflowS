## ADDED Requirements
### Requirement: Role-Based Dashboard System
The system SHALL provide personalized dashboards based on user roles as specified in Iteración 3.

#### Scenario: Docente dashboard access
- **WHEN** a docente logs into the system
- **THEN** they see overview of all their projects with status indicators
- **AND** they can access pending evaluations queue
- **AND** they view team performance metrics and contribution reports
- **AND** they receive alerts for overdue tasks and upcoming deadlines

#### Scenario: Estudiante dashboard access
- **WHEN** a student logs into the system
- **THEN** they see their assigned tasks with current status and deadlines
- **AND** they view their sprint progress and burndown chart
- **AND** they can access recent evaluations and detailed feedback
- **AND** they see team activity updates and notifications

#### Scenario: Scrum Master dashboard access
- **WHEN** a scrum master accesses their dashboard
- **THEN** they see current sprint burndown charts and velocity metrics
- **AND** they can identify team blockers and impediments
- **AND** they have tools to facilitate sprint planning
- **AND** they view team capacity and workload distribution

#### Scenario: Product Owner dashboard access
- **WHEN** a product owner logs into the system
- **THEN** they see product backlog prioritization and status
- **AND** they can review story acceptance criteria and progress
- **AND** they track progress against project goals and milestones
- **AND** they manage stakeholder expectations and deliverables