## ADDED Requirements

### Requirement: Project Data Export
Users SHALL be able to export complete project data.

#### Scenario: Export Project
- **WHEN** a user clicks export on a project
- **THEN** a JSON or CSV file is generated
- **AND** includes projects, sprints, stories, tasks, evaluations

### Requirement: Export Format Options
The system SHALL support multiple export formats.

#### Scenario: Format Selection
- **WHEN** initiating export
- **THEN** user can choose JSON or CSV format
- **AND** the file is downloaded automatically

### Requirement: Export Permissions
Only project members SHALL be able to export project data.

#### Scenario: Export Access
- **WHEN** a non-member attempts to export
- **THEN** they receive an access denied error</content>
<parameter name="filePath">openspec/changes/add-workflows-complete-features/specs/export/spec.md