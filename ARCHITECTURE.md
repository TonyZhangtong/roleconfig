# 规则配置管理系统 - 架构文档

## 1. 系统概述

**项目名称**: rule-config-manager  
**版本**: 1.0.0  
**描述**: 规则配置维护系统（MySQL数据库）  
**GitHub**: https://github.com/TonyZhangtong/roleconfig

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| **后端框架** | Node.js + Express 4.18.2 |
| **数据库** | MySQL 9.6 + mysql2 3.20.0 |
| **前端** | 原生 HTML5 + CSS3 + JavaScript (无框架) |
| **文件上传** | Multer 2.1.1 |
| **Excel处理** | xlsx 0.18.5 |
| **跨域** | CORS 2.8.5 |

---

## 3. 项目结构

```
c:\Users\Lenovo\CodeBuddy\20260323103605\
├── data/                    # 数据文件目录
│   └── rule_config.json     # 规则配置JSON数据
├── public/                  # 静态资源目录
│   └── index.html           # 前端主页面（单页应用）
├── db.js                    # 数据库连接池及CRUD操作
├── server.js                # Express服务端入口
├── init.sql                 # 数据库表结构定义
├── init_data.sql            # 初始数据脚本
├── setup_db.js              # 数据库初始化脚本
├── package.json             # 项目依赖配置
└── server.log               # 服务运行日志
```

---

## 4. 数据库架构

### 4.1 数据库配置

| 配置项 | 默认值 | 环境变量 |
|--------|--------|----------|
| Host | localhost | DB_HOST |
| Port | 3306 | DB_PORT |
| User | admin | DB_USER |
| Password | admin | DB_PASSWORD |
| Database | aiistdev | DB_NAME |
| Connection Limit | 10 | - |
| Timezone | +08:00 | - |

### 4.2 数据表结构

**表名**: `rule_config`  
**引擎**: InnoDB  
**字符集**: utf8mb4

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| ID | int (PK, AI) | 主键ID | PRIMARY |
| SCN_CID | varchar(250) | 场景分类ID | idx_scn_cid |
| RUL_MAJ | varchar(500) | 规则大类 | idx_rul_maj |
| RUL_CAT | varchar(500) | 规则类别 | idx_rul_cat |
| RUL_CAT_NAM_EXP | varchar(1000) | 规则类别名称解释 | - |
| COND_TYP | varchar(500) | 条件类型 | - |
| INTV_LWR_BND | decimal(38,2) | 区间下限 | - |
| INTV_UPR_BND | decimal(38,2) | 区间上限 | - |
| MTCH_VAL | varchar(500) | 匹配值 | - |
| SCR_VAL | decimal(38,2) | 得分值 | - |
| CREATE_TIME | datetime | 创建时间 | idx_create |
| UPDATE_TIME | datetime | 更新时间 | idx_update |

---

## 5. API 接口设计

### 5.1 RESTful API 列表

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| GET | `/api/rule-config` | 查询列表 | 支持分页、多条件筛选 |
| GET | `/api/rule-config/:id` | 查询单条 | 根据ID获取详情 |
| POST | `/api/rule-config` | 新增记录 | 创建新规则配置 |
| PUT | `/api/rule-config/:id` | 修改记录 | 更新指定ID记录 |
| DELETE | `/api/rule-config/:id` | 删除单条 | 删除指定ID记录 |
| DELETE | `/api/rule-config/batch` | 批量删除 | 传入ids数组批量删除 |
| GET | `/api/rule-config/template` | 下载模板 | 下载Excel导入模板 |
| POST | `/api/rule-config/import` | 导入Excel | 批量导入规则配置 |

### 5.2 查询参数

**GET /api/rule-config**

| 参数 | 类型 | 说明 |
|------|------|------|
| page | int | 页码，默认1 |
| pageSize | int | 每页条数，默认10 |
| scnCid | string | 场景分类ID（模糊匹配） |
| rulMaj | string | 规则大类（模糊匹配） |
| rulCat | string | 规则类别（模糊匹配） |
| condTyp | string | 条件类型（模糊匹配） |

### 5.3 响应格式

```json
{
  "code": 0,           // 0=成功，非0=错误
  "message": "提示信息",
  "data": [],          // 数据内容
  "total": 100,        // 总记录数（列表接口）
  "page": 1,           // 当前页
  "pageSize": 10       // 每页条数
}
```

---

## 6. 前端架构

### 6.1 页面结构

单页应用（SPA），主要区域：

1. **顶部导航栏** - 系统标题和副标题
2. **搜索条件区** - 多条件筛选表单
3. **数据表格区** - 规则配置列表展示
4. **分页控件** - 分页导航和页码选择
5. **新增/编辑模态框** - 表单弹窗
6. **确认删除框** - 二次确认弹窗
7. **Toast消息** - 操作反馈提示

### 6.2 前端功能模块

| 模块 | 功能 |
|------|------|
| 数据加载 | 异步加载表格数据，支持分页 |
| 条件搜索 | 多字段模糊查询 |
| 单条操作 | 新增、编辑、删除 |
| 批量操作 | 批量选择、批量删除 |
| Excel导入 | 模板下载、文件上传导入 |
| 表单验证 | 必填字段校验 |

---

## 7. 核心功能流程

### 7.1 数据查询流程

```
用户输入条件 → 前端组装参数 → API请求 → 数据库查询 → 返回分页结果 → 渲染表格
```

### 7.2 Excel导入流程

```
用户点击下载模板 → 服务端生成XLSX → 浏览器下载
用户选择Excel文件 → 前端FormData上传 → 服务端解析 → 逐行插入数据库 → 返回导入结果
```

### 7.3 批量删除流程

```
用户勾选记录 → 点击批量删除 → 确认弹窗 → 发送ids数组 → 数据库批量删除 → 刷新列表
```

---

## 8. 部署说明

### 8.1 环境要求

- Node.js >= 14.0
- MySQL >= 8.0

### 8.2 启动步骤

```bash
# 1. 安装依赖
npm install

# 2. 配置数据库（可选，默认连接localhost:3306）
set DB_HOST=localhost
set DB_PORT=3306
set DB_USER=admin
set DB_PASSWORD=admin
set DB_NAME=aiistdev

# 3. 初始化数据库（首次运行）
node setup_db.js

# 4. 启动服务
npm start
# 或
node server.js
```

### 8.3 访问地址

- 应用地址: http://localhost:3000
- API基础路径: http://localhost:3000/api/rule-config

---

## 9. 安全与优化

### 9.1 安全措施

- SQL注入防护：使用参数化查询（mysql2/promise）
- XSS防护：前端HTML转义输出
- 文件上传限制：10MB大小限制，仅内存存储

### 9.2 性能优化

- 数据库连接池（10连接）
- 数据库索引优化（5个索引）
- 分页查询（避免大数据量查询）
- 静态资源缓存（express.static）

---

## 10. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-03-23 | 初始版本，包含基础CRUD、Excel导入、批量删除 |

---

*文档生成时间: 2026-03-23*
