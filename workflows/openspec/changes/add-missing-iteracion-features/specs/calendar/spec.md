## ADDED Requirements
### Requirement: Calendar Events System (F13)
The system SHALL provide a calendar view for project milestones and deadlines as specified in Iteración 4.

#### Scenario: View project calendar
- **WHEN** a user accesses the project calendar
- **THEN** they see all sprint dates, deadlines, and milestones
- **AND** different event types are color-coded (sprints, deadlines, evaluations)
- **AND** they can filter by event type or project
- **AND** they can switch between month, week, and day views

#### Scenario: Calendar notifications
- **WHEN** a sprint deadline approaches within 48 hours
- **THEN** the system sends automatic notifications to affected users
- **AND** users receive email reminders for upcoming deadlines
- **AND** the dashboard shows upcoming deadlines prominently
- **AND** users can set custom notification preferences

#### Scenario: External calendar integration
- **WHEN** a user wants to integrate with external calendar
- **THEN** they can export events to Google Calendar or Outlook
- **AND** the export includes all project-related dates and milestones
- **AND** updates sync automatically when dates change
- **AND** users can select which events to export