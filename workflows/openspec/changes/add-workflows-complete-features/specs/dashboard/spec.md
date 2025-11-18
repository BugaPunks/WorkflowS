## ADDED Requirements

### Requirement: Role-Based Dashboard Views
The system SHALL provide different dashboard content based on user roles.

#### Scenario: Admin Dashboard
- **WHEN** an admin logs in
- **THEN** they see system-wide statistics and user management options

#### Scenario: Teacher Dashboard
- **WHEN** a docente logs in
- **THEN** they see projects they supervise with evaluation tools

#### Scenario: Student Dashboard
- **WHEN** an estudiante logs in
- **THEN** they see assigned tasks and project progress

### Requirement: Dashboard Navigation
Users SHALL have easy access to relevant project features from their dashboard.

#### Scenario: Quick Access Links
- **WHEN** on dashboard
- **THEN** users see shortcuts to recent projects and pending tasks</content>
<parameter name="filePath">openspec/changes/add-workflows-complete-features/specs/dashboard/spec.md