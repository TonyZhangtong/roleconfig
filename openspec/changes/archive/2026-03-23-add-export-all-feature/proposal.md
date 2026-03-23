## Why

当前系统支持通过 Excel 模板导入规则配置，但缺少导出功能。用户无法将现有配置导出备份或迁移到其他环境。需要新增一键导出功能，导出格式与导入模板保持一致，方便数据的导入导出循环使用。

## What Changes

- **新增后端 API 接口**: `GET /api/rule-config/export` - 导出所有规则配置为 Excel
- **新增前端功能**: 在工具栏添加"导出全部"按钮
- **复用模板格式**: 导出文件格式与导入模板一致，包含相同的列头和数据格式
- **文件命名**: 导出文件带时间戳，如 `rule_config_export_20260323_143022.xlsx`

## Capabilities

### New Capabilities
- `export-all-configs`: 一键导出所有规则配置功能，导出格式与导入模板兼容

### Modified Capabilities
- 无（此功能为纯新增，不涉及现有功能变更）

## Impact

- **后端**: `server.js` 新增导出接口，复用现有的 xlsx 依赖
- **前端**: `public/index.html` 工具栏新增导出按钮
- **用户体验**: 支持数据备份和跨环境迁移
