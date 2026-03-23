const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:            parseInt(process.env.DB_PORT || '3306'),
  user:            process.env.DB_USER     || 'admin',
  password:        process.env.DB_PASSWORD || 'admin',
  database:        process.env.DB_NAME     || 'aiistdev',
  connectionLimit: 10,
  timezone:        '+08:00',
});

// ========== CRUD 方法 ==========

async function getList({ page = 1, pageSize = 10, scnCid = '', rulMaj = '', rulCat = '', condTyp = '' } = {}) {
  const conditions = [];
  const params = [];

  if (scnCid)  { conditions.push('SCN_CID  LIKE ?'); params.push(`%${scnCid}%`);  }
  if (rulMaj)  { conditions.push('RUL_MAJ  LIKE ?'); params.push(`%${rulMaj}%`);  }
  if (rulCat)  { conditions.push('RUL_CAT  LIKE ?'); params.push(`%${rulCat}%`);  }
  if (condTyp) { conditions.push('COND_TYP LIKE ?'); params.push(`%${condTyp}%`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const p  = parseInt(page);
  const ps = parseInt(pageSize);
  const offset = (p - 1) * ps;

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM rule_config ${where}`,
    params
  );

  const [data] = await pool.query(
    `SELECT * FROM rule_config ${where} ORDER BY ID DESC LIMIT ? OFFSET ?`,
    [...params, ps, offset]
  );

  return { data, total, page: p, pageSize: ps };
}

async function getById(id) {
  const [[row]] = await pool.query('SELECT * FROM rule_config WHERE ID = ?', [parseInt(id)]);
  return row || null;
}

async function insert(fields) {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const [result] = await pool.query(
    `INSERT INTO rule_config
      (SCN_CID, RUL_MAJ, RUL_CAT, RUL_CAT_NAM_EXP, COND_TYP,
       INTV_LWR_BND, INTV_UPR_BND, MTCH_VAL, SCR_VAL, CREATE_TIME, UPDATE_TIME)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fields.SCN_CID         || null,
      fields.RUL_MAJ         || null,
      fields.RUL_CAT         || null,
      fields.RUL_CAT_NAM_EXP || null,
      fields.COND_TYP        || null,
      fields.INTV_LWR_BND != null && fields.INTV_LWR_BND !== '' ? parseFloat(fields.INTV_LWR_BND) : null,
      fields.INTV_UPR_BND != null && fields.INTV_UPR_BND !== '' ? parseFloat(fields.INTV_UPR_BND) : null,
      fields.MTCH_VAL        ?? null,
      fields.SCR_VAL  != null && fields.SCR_VAL  !== '' ? parseFloat(fields.SCR_VAL)  : null,
      now,
      now,
    ]
  );
  return result.insertId;
}

async function update(id, fields) {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const [result] = await pool.query(
    `UPDATE rule_config SET
      SCN_CID = ?, RUL_MAJ = ?, RUL_CAT = ?, RUL_CAT_NAM_EXP = ?,
      COND_TYP = ?, INTV_LWR_BND = ?, INTV_UPR_BND = ?, MTCH_VAL = ?, SCR_VAL = ?,
      UPDATE_TIME = ?
     WHERE ID = ?`,
    [
      fields.SCN_CID         ?? null,
      fields.RUL_MAJ         ?? null,
      fields.RUL_CAT         ?? null,
      fields.RUL_CAT_NAM_EXP ?? null,
      fields.COND_TYP        ?? null,
      fields.INTV_LWR_BND != null && fields.INTV_LWR_BND !== '' ? parseFloat(fields.INTV_LWR_BND) : null,
      fields.INTV_UPR_BND != null && fields.INTV_UPR_BND !== '' ? parseFloat(fields.INTV_UPR_BND) : null,
      fields.MTCH_VAL        ?? null,
      fields.SCR_VAL  != null && fields.SCR_VAL  !== '' ? parseFloat(fields.SCR_VAL)  : null,
      now,
      parseInt(id),
    ]
  );
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM rule_config WHERE ID = ?', [parseInt(id)]);
  return result.affectedRows > 0;
}

async function batchRemove(ids) {
  if (!ids || ids.length === 0) return 0;
  const [result] = await pool.query('DELETE FROM rule_config WHERE ID IN (?)', [ids.map(Number)]);
  return result.affectedRows;
}

async function clearAll() {
  const [result] = await pool.query('DELETE FROM rule_config');
  return result.affectedRows;
}

async function getAll() {
  const [data] = await pool.query('SELECT * FROM rule_config ORDER BY ID ASC');
  return data;
}

module.exports = { pool, getList, getById, insert, update, remove, batchRemove, clearAll, getAll };
