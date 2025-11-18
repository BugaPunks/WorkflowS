## ADDED Requirements

### Requirement: Task Assignment Notifications
The system SHALL notify users when tasks are assigned to them.

#### Scenario: Task Assignment Alert
- **WHEN** a task is assigned to a user
- **THEN** a notification is created in their inbox
- **AND** they can mark it as read

### Requirement: Evaluation Notifications
The system SHALL notify students when evaluations are submitted for their work.

#### Scenario: Evaluation Submitted Alert
- **WHEN** a teacher submits an evaluation
- **THEN** the student receives a notification with evaluation details

### Requirement: Deadline Notifications
The system SHALL notify users of upcoming sprint deadlines.

#### Scenario: Sprint Deadline Reminder
- **WHEN** a sprint end date is approaching (within 3 days)
- **THEN** all project members receive deadline notifications

### Requirement: Notification Management
Users SHALL be able to view and manage their notifications.

#### Scenario: View Notification Inbox
- **WHEN** a user clicks the notification bell
- **THEN** they see unread and recent notifications
- **AND** can mark them as read or navigate to related content</content>
<parameter name="filePath">openspec/changes/add-workflows-complete-features/specs/notifications/spec.md