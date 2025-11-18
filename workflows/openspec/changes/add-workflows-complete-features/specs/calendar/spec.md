## ADDED Requirements

### Requirement: Task Comments
Users SHALL be able to add comments to tasks for communication.

#### Scenario: Add Comment
- **WHEN** a user views task details
- **THEN** they can add a comment
- **AND** the comment appears with author and timestamp

### Requirement: Comment Thread Display
Comments SHALL be displayed in chronological order.

#### Scenario: View Comment History
- **WHEN** opening task details
- **THEN** all comments are shown in order
- **AND** new comments appear at the bottom

### Requirement: Comment Permissions
Only project members SHALL be able to comment on tasks.

#### Scenario: Comment Access
- **WHEN** a non-project member attempts to comment
- **THEN** they receive an access denied error</content>
<parameter name="filePath">openspec/changes/add-workflows-complete-features/specs/communication/spec.md