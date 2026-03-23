const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');
const db         = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==================== 规则配置 API ====================

// 查询列表（分页 + 多条件筛选）
app.get('/api/rule-config', async (req, res) => {
  try {
    const { page, pageSize, scnCid, rulMaj, rulCat, condTyp } = req.query;
    const result = await db.getList({ page, pageSize, scnCid, rulMaj, rulCat, condTyp });
    res.json({ code: 0, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 批量删除（必须在 /:id 路由之前注册）
app.delete('/api/rule-config/batch', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ code: 400, message: '请传入ids数组' });
    const deleted = await db.batchRemove(ids);
    res.json({ code: 0, message: `已删除 ${deleted} 条记录` });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 查询单条
app.get('/api/rule-config/:id', async (req, res) => {
  try {
    const record = await db.getById(req.params.id);
    if (!record) return res.status(404).json({ code: 404, message: '记录不存在' });
    res.json({ code: 0, data: record });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 新增
app.post('/api/rule-config', async (req, res) => {
  try {
    const insertId = await db.insert(req.body);
    res.json({ code: 0, message: '新增成功', id: insertId });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 修改
app.put('/api/rule-config/:id', async (req, res) => {
  try {
    const ok = await db.update(req.params.id, req.body);
    if (!ok) return res.status(404).json({ code: 404, message: '记录不存在' });
    res.json({ code: 0, message: '修改成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 删除单条
app.delete('/api/rule-config/:id', async (req, res) => {
  try {
    const ok = await db.remove(req.params.id);
    if (!ok) return res.status(404).json({ code: 404, message: '记录不存在' });
    res.json({ code: 0, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 根路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`服务已启动：http://localhost:${PORT}`);
});
