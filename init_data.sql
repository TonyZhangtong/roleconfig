-- 建表（如已存在则跳过）
CREATE TABLE IF NOT EXISTS `rule_config` (
  `ID`              int            NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `SCN_CID`         varchar(250)   DEFAULT NULL COMMENT '场景分类ID',
  `RUL_MAJ`         varchar(500)   DEFAULT NULL COMMENT '规则大类',
  `RUL_CAT`         varchar(500)   DEFAULT NULL COMMENT '规则类别',
  `RUL_CAT_NAM_EXP` varchar(1000)  DEFAULT NULL COMMENT '规则类别名称解释',
  `COND_TYP`        varchar(500)   DEFAULT NULL COMMENT '条件类型',
  `INTV_LWR_BND`    decimal(38,2)  DEFAULT NULL COMMENT '区间下限',
  `INTV_UPR_BND`    decimal(38,2)  DEFAULT NULL COMMENT '区间上限',
  `MTCH_VAL`        varchar(500)   DEFAULT NULL COMMENT '匹配值',
  `SCR_VAL`         decimal(38,2)  DEFAULT NULL COMMENT '得分值',
  `CREATE_TIME`     datetime       DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UPDATE_TIME`     datetime       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`ID`),
  KEY `idx_scn_cid` (`SCN_CID`),
  KEY `idx_rul_maj` (`RUL_MAJ`),
  KEY `idx_rul_cat` (`RUL_CAT`),
  KEY `idx_create`  (`CREATE_TIME`),
  KEY `idx_update`  (`UPDATE_TIME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='规则配置表';

-- 初始化数据（重复执行安全）
INSERT IGNORE INTO `rule_config` (ID, SCN_CID, RUL_MAJ, RUL_CAT, RUL_CAT_NAM_EXP, COND_TYP, INTV_LWR_BND, INTV_UPR_BND, MTCH_VAL, SCR_VAL, CREATE_TIME, UPDATE_TIME) VALUES
(1670, 'CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', -999999999999999999999999999999999999.99, 50.00, '', -20.00, '2026-03-13 11:14:44', '2026-03-13 11:14:44'),
(1671, 'CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', 50.00, 150.00, '', -8.00, '2026-03-13 11:14:44', '2026-03-13 11:14:44'),
(1672, 'CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', 150.00, 250.00, '', 7.00, '2026-03-13 11:14:44', '2026-03-13 11:14:44'),
(1674, 'CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', 500.00, 1500.00, '', 29.00, '2026-03-13 11:14:44', '2026-03-13 11:14:44'),
(1675, 'CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', 1500.00, 10000.00, '', 46.00, '2026-03-13 11:14:44', '2026-03-13 11:14:44'),
(1676, 'CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', 10000.00, 999999999999999999999999999999999999.99, '', 65.00, '2026-03-13 11:14:44', '2026-03-13 11:14:44'),
(1677, 'CJ000', '经营评分', 'REG_DUR', '注册时长（单位：年）', 'RANGE', -999999999999999999999999999999999999.99, 3.00, '', -24.00, '2026-03-13 11:14:44', '2026-03-13 11:14:44'),
(1678, 'CJ000', '经营评分', 'REG_DUR', '注册时长（单位：年）', 'RANGE', 3.00, 8.00, '', 0.00, '2026-03-13 11:14:44', '2026-03-13 11:14:44'),
(1679, 'CJ000', '经营评分', 'EMPL_CNT', '职工人数', 'RANGE', 60.00, 0.00, '', -20.00, '2026-03-23 03:13:35', '2026-03-23 03:24:01'),
(1681, '1', '1', '1', '1', '1', 1.00, 1.00, '1', 1.00, '2026-03-23 03:23:43', '2026-03-23 03:23:43');
