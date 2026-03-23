## Why

当前规则配置管理系统缺少快速清空所有数据的功能。当用户需要重置系统或清理测试数据时，必须逐条删除或批量选择删除，操作繁琐且效率低下。需要提供一个"一键清空"功能，让用户能够快速、安全地清除所有规则配置。

## What Changes

- **新增后端 API 接口**: `DELETE /api/rule-config/clear-all` - 清空所有规则配置
- **新增前端功能**: 在工具栏添加"一键清空"按钮，带二次确认弹窗
- **新增数据库操作**: `clearAll()` 方法 - 执行 TRUNCATE 或 DELETE 操作
- **安全机制**: 二次确认 + 操作结果提示，防止误操作

## Capabilities

### New Capabilities
- `clear-all-configs`: 一键清空所有规则配置功能，包含后端API、前端按钮和安全确认机制

### Modified Capabilities
- 无（此功能为纯新增，不涉及现有功能变更）

## Impact

- **后端**: `server.js` 新增删除接口，`db.js` 新增清空方法
- **前端**: `public/index.html` 工具栏新增按钮和确认弹窗
- **数据库**: 执行 `TRUNCATE TABLE rule_config` 或等效操作
- **API**: 新增 `DELETE /api/rule-config/clear-all` 端点
- **用户体验**: 提供快速数据清理能力，提升管理效率
