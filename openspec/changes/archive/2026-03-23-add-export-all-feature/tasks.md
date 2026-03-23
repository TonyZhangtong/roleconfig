## 1. Backend Implementation

- [x] 1.1 Add `getAll()` method in `db.js` to query all records from rule_config
- [x] 1.2 Add `GET /api/rule-config/export` endpoint in `server.js` to generate Excel file
- [x] 1.3 Implement filename with timestamp format: `rule_config_export_YYYYMMDD_HHMMSS.xlsx`
- [x] 1.4 Ensure exported Excel format matches import template (same headers and column order)

## 2. Frontend Implementation

- [x] 2.1 Add "导出全部" button in toolbar (next to import button) in `public/index.html`
- [x] 2.2 Add `exportAll()` function to trigger file download
- [x] 2.3 Add loading indicator during export operation
- [x] 2.4 Add success/error toast messages after export completes

## 3. Integration & Testing

- [ ] 3.1 Restart server and test export with data
- [ ] 3.2 Verify exported file can be re-imported (round-trip test)
- [ ] 3.3 Test export when table is empty
- [ ] 3.4 Verify filename contains correct timestamp
