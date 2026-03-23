## ADDED Requirements

### Requirement: Backend API for exporting all configurations
The system SHALL provide an API endpoint to export all rule configurations as an Excel file.

#### Scenario: Successfully export all configurations
- **WHEN** a GET request is sent to `/api/rule-config/export`
- **THEN** the system SHALL query all records from rule_config table
- **AND** generate an Excel file with the same format as the import template
- **AND** set the filename to `rule_config_export_YYYYMMDD_HHMMSS.xlsx`
- **AND** return the file as a downloadable attachment

#### Scenario: Export when table is empty
- **WHEN** a GET request is sent to `/api/rule-config/export` and the table is empty
- **THEN** the system SHALL generate an Excel file with only headers (no data rows)
- **AND** return the file as a downloadable attachment

#### Scenario: Database error during export
- **WHEN** a GET request is sent to `/api/rule-config/export` and a database error occurs
- **THEN** the system SHALL return a JSON response with code 500 and an error message

### Requirement: Excel file format compatibility
The exported Excel file SHALL be compatible with the import template format.

#### Scenario: Export format matches import template
- **WHEN** the export file is generated
- **THEN** the column headers SHALL be: SCN_CID, RUL_MAJ, RUL_CAT, RUL_CAT_NAM_EXP, COND_TYP, INTV_LWR_BND, INTV_UPR_BND, MTCH_VAL, SCR_VAL
- **AND** the column order SHALL match the import template
- **AND** the data types SHALL be compatible with the import function

### Requirement: Frontend export button
The system SHALL provide an "Export All" button in the toolbar.

#### Scenario: Display export button
- **WHEN** the user views the rule configuration list page
- **THEN** the system SHALL display an "Export All" button in the toolbar

#### Scenario: Click export button triggers download
- **WHEN** the user clicks the "Export All" button
- **THEN** the system SHALL initiate a download of the exported Excel file
- **AND** display a loading indicator during the export process

### Requirement: Export filename with timestamp
The exported file SHALL include a timestamp in the filename.

#### Scenario: Filename contains date and time
- **WHEN** the export file is generated on 2026-03-23 at 14:30:22
- **THEN** the filename SHALL be `rule_config_export_20260323_143022.xlsx`
- **AND** the timestamp SHALL be in the local timezone (+08:00)
