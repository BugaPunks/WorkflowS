## ADDED Requirements
### Requirement: Project Templates System
The system SHALL provide project template functionality as specified in "Ideas Adicionales".

#### Scenario: Create project template
- **WHEN** a docente creates a new project template
- **THEN** they can define default sprints with durations and objectives
- **AND** they can include sample user stories and acceptance criteria
- **AND** they can set default team roles and responsibilities
- **AND** they can specify evaluation criteria and milestones

#### Scenario: Apply template to new project
- **WHEN** a docente creates a new project
- **THEN** they can browse and select from available templates
- **AND** system pre-populates project structure based on template
- **AND** they can customize and modify template content after application
- **AND** template maintains original structure for future use

#### Scenario: Template sharing and management
- **WHEN** a docente creates a useful template
- **THEN** they can share it with other docentes in the institution
- **AND** administrators can review and approve templates for institutional use
- **AND** templates can be categorized by subject or project type
- **AND** system tracks template usage and popularity

#### Scenario: Template versioning
- **WHEN** a docente modifies an existing template
- **THEN** the system creates a new version while preserving previous versions
- **AND** existing projects continue using their original template version
- **AND** new projects can select from available template versions
- **AND** system maintains change history between template versions