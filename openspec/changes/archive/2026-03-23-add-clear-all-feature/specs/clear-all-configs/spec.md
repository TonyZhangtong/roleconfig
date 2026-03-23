## ADDED Requirements

### Requirement: Backend API for clearing all configurations
The system SHALL provide an API endpoint to delete all rule configurations.

#### Scenario: Successfully clear all configurations
- **WHEN** a DELETE request is sent to `/api/rule-config/clear-all`
- **THEN** the system SHALL delete all records from the rule_config table
- **AND** return a JSON response with code 0 and the count of deleted records

#### Scenario: Clear all when table is empty
- **WHEN** a DELETE request is sent to `/api/rule-config/clear-all` and the table is already empty
- **THEN** the system SHALL return a JSON response with code 0 and message indicating 0 records deleted

#### Scenario: Database error during clear operation
- **WHEN** a DELETE request is sent to `/api/rule-config/clear-all` and a database error occurs
- **THEN** the system SHALL return a JSON response with code 500 and an error message

### Requirement: Database clear operation
The system SHALL implement a database method to delete all records from rule_config table.

#### Scenario: Clear all records via database method
- **WHEN** the `clearAll()` method is called
- **THEN** the system SHALL execute DELETE FROM rule_config
- **AND** return the number of affected rows

### Requirement: Frontend clear-all button
The system SHALL provide a "Clear All" button in the toolbar for quick access.

#### Scenario: Display clear-all button
- **WHEN** the user views the rule configuration list page
- **THEN** the system SHALL display a red "Clear All" button in the toolbar

#### Scenario: Click clear-all button triggers confirmation
- **WHEN** the user clicks the "Clear All" button
- **THEN** the system SHALL display a confirmation dialog showing the current record count
- **AND** require the user to confirm before proceeding

### Requirement: Confirmation dialog for clear-all operation
The system SHALL display a confirmation dialog before executing the clear-all operation.

#### Scenario: Confirmation dialog shows record count
- **WHEN** the confirmation dialog is displayed
- **THEN** it SHALL show the message "确定要清空所有 X 条记录吗？此操作不可撤销。" where X is the current record count

#### Scenario: User confirms clear-all operation
- **WHEN** the user clicks the "确认清空" button in the confirmation dialog
- **THEN** the system SHALL send the DELETE request to the API
- **AND** close the confirmation dialog

#### Scenario: User cancels clear-all operation
- **WHEN** the user clicks the "取消" button in the confirmation dialog
- **THEN** the system SHALL close the dialog without making any changes

### Requirement: Success feedback after clear-all
The system SHALL provide visual feedback after a successful clear-all operation.

#### Scenario: Display success toast
- **WHEN** the clear-all operation completes successfully
- **THEN** the system SHALL display a green success toast with the message "已清空 X 条记录"
- **AND** refresh the data table to show empty state

#### Scenario: Display error toast on failure
- **WHEN** the clear-all operation fails
- **THEN** the system SHALL display a red error toast with the error message
