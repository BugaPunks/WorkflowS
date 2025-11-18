## ADDED Requirements
### Requirement: Calendar Events System
The system SHALL provide a comprehensive calendar system for project events as specified in Iteration 4.

#### Scenario: View project calendar
- **WHEN** a user accesses the project calendar
- **THEN** they see all project events including sprints, deadlines, and evaluations
- **AND** events are displayed in month, week, and day views
- **AND** different event types have distinct colors and icons
- **AND** users can filter events by type or assignee

#### Scenario: Automatic event creation
- **WHEN** a sprint is created or updated
- **THEN** sprint start and end dates are automatically added to the calendar
- **AND** evaluation deadlines are automatically scheduled
- **AND** milestone dates are tracked in the calendar
- **AND** changes to project dates update calendar events

#### Scenario: Calendar notifications
- **WHEN** an event deadline approaches within 48 hours
- **THEN** the system sends automatic notifications to affected users
- **AND** users receive email reminders for important events
- **AND** dashboard shows upcoming deadlines prominently
- **AND** users can configure notification preferences

#### Scenario: External calendar integration
- **WHEN** a user wants to sync with external calendar
- **THEN** they can export project events to Google Calendar or Outlook
- **AND** the export includes all event details and descriptions
- **AND** updates to project dates sync automatically
- **AND** users can select which events to export

#### Scenario: Custom events
- **WHEN** a docente needs to add a custom event
- **THEN** they can create events like "Presentación Final" or "Revisión de Código"
- **AND** custom events appear in the calendar with appropriate styling
- **AND** custom events can have attendees and reminders
- **AND** events can be recurring or one-time

#### Scenario: Calendar sharing
- **WHEN** team members need to coordinate
- **THEN** they can view each other's calendar availability
- **AND** calendar shows busy/free status for team members
- **AND** users can share their project calendar with external stakeholders
- **AND** calendar access respects project permissions