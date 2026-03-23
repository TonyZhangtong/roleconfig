## 1. Backend Implementation

- [x] 1.1 Add `clearAll()` method in `db.js` to execute DELETE FROM rule_config
- [x] 1.2 Add `DELETE /api/rule-config/clear-all` endpoint in `server.js`
- [x] 1.3 Test backend API with curl/Postman to verify it returns correct response format

## 2. Frontend Implementation

- [x] 2.1 Add "清空全部" button in toolbar (red danger style) in `public/index.html`
- [x] 2.2 Add `confirmClearAll()` function to show confirmation dialog with record count
- [x] 2.3 Add `doClearAll()` function to call API and handle response
- [x] 2.4 Add success/error toast messages after operation completes
- [x] 2.5 Refresh data table after successful clear operation

## 3. Integration & Testing

- [ ] 3.1 Restart server and test full flow: add data → click clear → confirm → verify empty
- [ ] 3.2 Test cancel operation: click clear → cancel → verify data unchanged
- [ ] 3.3 Test edge case: clear when table is already empty
