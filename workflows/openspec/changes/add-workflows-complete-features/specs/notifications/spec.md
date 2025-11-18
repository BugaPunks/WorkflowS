## ADDED Requirements

### Requirement: Burndown Chart Generation
The system SHALL generate burndown charts showing planned vs actual story points over sprint duration.

#### Scenario: View Sprint Burndown
- **WHEN** a user accesses the reports tab for a sprint
- **THEN** they see a chart plotting ideal burndown line vs actual progress
- **AND** the chart updates as tasks are completed

### Requirement: Individual Contribution Reports
The system SHALL provide reports showing each team member's contribution to sprint completion.

#### Scenario: Generate Contribution Report
- **WHEN** a teacher or admin accesses sprint reports
- **THEN** they see a breakdown of tasks completed by each student
- **AND** metrics include story points completed and tasks closed

### Requirement: Project Performance Metrics
The system SHALL aggregate metrics across sprints for overall project performance.

#### Scenario: View Project Metrics
- **WHEN** accessing project reports
- **THEN** users see velocity trends and completion rates across all sprints</content>
<parameter name="filePath">openspec/changes/add-workflows-complete-features/specs/metrics-reports/spec.md