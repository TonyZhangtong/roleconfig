const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');
const multer     = require('multer');
const XLSX       = require('xlsx');
const db         = require('./db');

// multer 内存存储（不写磁盘）
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

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

// 下载导入模板（必须在 /:id 路由之前注册）
app.get('/api/rule-config/template', (req, res) => {
  const headers = [
    'SCN_CID', 'RUL_MAJ', 'RUL_CAT', 'RUL_CAT_NAM_EXP',
    'COND_TYP', 'INTV_LWR_BND', 'INTV_UPR_BND', 'MTCH_VAL', 'SCR_VAL'
  ];
  const example = [
    ['CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', -999999, 50, '', -20],
    ['CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', 50, 150, '', -8],
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...example]);
  // 设置列宽
  ws['!cols'] = [16,16,16,30,12,16,16,16,12].map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, '规则配置');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="rule_config_template.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
});

// Excel 批量导入（必须在 /:id 路由之前注册）
app.post('/api/rule-config/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ code: 400, message: '请上传文件' });
    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
    if (!rows.length) return res.status(400).json({ code: 400, message: 'Excel 内容为空' });

    const fieldMap = {
      SCN_CID: 'SCN_CID', RUL_MAJ: 'RUL_MAJ', RUL_CAT: 'RUL_CAT',
      RUL_CAT_NAM_EXP: 'RUL_CAT_NAM_EXP', COND_TYP: 'COND_TYP',
      INTV_LWR_BND: 'INTV_LWR_BND', INTV_UPR_BND: 'INTV_UPR_BND',
      MTCH_VAL: 'MTCH_VAL', SCR_VAL: 'SCR_VAL'
    };

    let success = 0, failed = 0, errors = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const fields = {};
      Object.keys(fieldMap).forEach(k => { fields[k] = row[k] ?? null; });
      if (!fields.SCN_CID) { failed++; errors.push(`第${i+2}行: SCN_CID 不能为空`); continue; }
      try {
        await db.insert(fields);
        success++;
      } catch (e) {
        failed++;
        errors.push(`第${i+2}行: ${e.message}`);
      }
    }
    res.json({ code: 0, message: `导入完成：成功 ${success} 条，失败 ${failed} 条`, success, failed, errors });
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
