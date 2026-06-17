-- ============================================================
-- 黔行智导 · 数据库建表 DDL (MySQL 8.0+)
-- Version: 2.1 | Charset: utf8mb4 | PHASE-4-A-DB-REVISED
-- ============================================================
-- 数据库名：qianxing_zhidao
-- 连接信息：
--   JDBC URL: jdbc:mysql://localhost:3306/qianxing_zhidao
--     ?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false
--   Spring:  username=${DB_USERNAME:root} password=${DB_PASSWORD:}
-- 数据库状态：尚未创建，本 SQL 仅用于用户确认后手动执行
-- 当前阶段：禁止自动执行 SQL，禁止连接数据库
-- 无强制外键约束，使用逻辑外键 + 索引
-- ============================================================

CREATE DATABASE IF NOT EXISTS qianxing_zhidao
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qianxing_zhidao;

-- ============================================
-- 1. 用户表 (微信小程序登录, 预留unionid)
-- ============================================
CREATE TABLE qx_user (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  openid      VARCHAR(64)  NOT NULL               COMMENT '微信openid',
  unionid     VARCHAR(64)  DEFAULT NULL           COMMENT '微信unionid(预留)',
  nickname    VARCHAR(64)                         COMMENT '微信昵称',
  avatar_url  VARCHAR(512)                        COMMENT '头像URL',
  phone       VARCHAR(20)                         COMMENT '手机号',
  status      TINYINT      NOT NULL DEFAULT 1     COMMENT '1=正常 0=禁用',
  deleted     TINYINT      NOT NULL DEFAULT 0     COMMENT '逻辑删除',
  created_at  DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at  DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  UNIQUE INDEX idx_user_openid (openid),
  INDEX idx_user_unionid (unionid),
  INDEX idx_user_status (status)
) ENGINE=InnoDB COMMENT='用户表';

-- ============================================
-- 2. 景点表
-- ============================================
CREATE TABLE qx_scenic_spot (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  spot_code      VARCHAR(32)  NOT NULL               COMMENT '景点编码, e.g. huangguoshu',
  name           VARCHAR(100) NOT NULL               COMMENT '景点名称',
  city           VARCHAR(50)  NOT NULL               COMMENT '所在城市',
  region_code    VARCHAR(6)                          COMMENT '行政区划代码',
  category       VARCHAR(20)  NOT NULL               COMMENT '分类:自然风光/民族文化/古镇历史/户外探险',
  rating         DECIMAL(2,1) NOT NULL DEFAULT 0     COMMENT '评分 1-5',
  ticket_price   INT          NOT NULL DEFAULT 0     COMMENT '门票(分) 0=免费',
  visit_duration VARCHAR(20)                         COMMENT '建议游览时长',
  best_season    VARCHAR(50)                         COMMENT '最佳季节',
  description    TEXT                                COMMENT '简介描述',
  highlights     JSON                                COMMENT '亮点列表',
  tips           JSON                                COMMENT '旅行贴士',
  tags           JSON                                COMMENT '标签',
  latitude       DECIMAL(10,7)                       COMMENT '纬度',
  longitude      DECIMAL(10,7)                       COMMENT '经度',
  sort_order     INT          NOT NULL DEFAULT 0     COMMENT '排序',
  status         TINYINT      NOT NULL DEFAULT 1     COMMENT '1=发布 0=下架',
  deleted        TINYINT      NOT NULL DEFAULT 0     COMMENT '逻辑删除',
  created_at     DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at     DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  UNIQUE INDEX idx_spot_code (spot_code),
  INDEX idx_spot_city (city),
  INDEX idx_spot_category (category),
  INDEX idx_spot_status (status),
  INDEX idx_spot_region (region_code)
) ENGINE=InnoDB COMMENT='景点表';

-- ============================================
-- 3. 路线模板表
-- ============================================
CREATE TABLE qx_route (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  route_code     VARCHAR(32)  NOT NULL               COMMENT '路线编码, e.g. route-1',
  name           VARCHAR(128) NOT NULL               COMMENT '路线名称',
  description    TEXT                                COMMENT '路线描述',
  day_count      INT          NOT NULL DEFAULT 1     COMMENT '天数',
  energy_level   VARCHAR(8)   NOT NULL               COMMENT '轻松/适中/挑战',
  budget_range   VARCHAR(32)                         COMMENT '预算范围',
  suitable_crowd JSON                                COMMENT '适合人群',
  tags           JSON                                COMMENT '特色标签',
  theme          VARCHAR(32)                         COMMENT '主题:waterfall/mountain/village/cave/ancient-town/forest/culture',
  cover_image    VARCHAR(512)                        COMMENT '封面图URL',
  sort_order     INT          NOT NULL DEFAULT 0     COMMENT '排序',
  status         TINYINT      NOT NULL DEFAULT 1     COMMENT '1=发布 0=下架',
  deleted        TINYINT      NOT NULL DEFAULT 0     COMMENT '逻辑删除',
  created_at     DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at     DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  UNIQUE INDEX idx_route_code (route_code),
  INDEX idx_route_energy (energy_level),
  INDEX idx_route_theme (theme),
  INDEX idx_route_status (status)
) ENGINE=InnoDB COMMENT='路线模板表';

-- ============================================
-- 4. 路线每日安排表
-- ============================================
CREATE TABLE qx_route_day (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  route_id      BIGINT       NOT NULL               COMMENT '关联qx_route.id',
  day_number    INT          NOT NULL               COMMENT '第几天(1-based)',
  title         VARCHAR(128) NOT NULL               COMMENT '当天标题',
  description   TEXT                                COMMENT '当天说明',
  meals         VARCHAR(256)                        COMMENT '餐饮建议',
  accommodation VARCHAR(256)                        COMMENT '住宿建议',
  sort_order    INT          NOT NULL DEFAULT 0     COMMENT '排序',
  created_at    DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at    DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  INDEX idx_rday_route (route_id),
  UNIQUE INDEX idx_rday_route_day (route_id, day_number)
) ENGINE=InnoDB COMMENT='路线每日安排表';

-- ============================================
-- 5. 路线景点关联表
-- ============================================
CREATE TABLE qx_route_spot (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  route_day_id   BIGINT       NOT NULL              COMMENT '关联qx_route_day.id',
  route_id       BIGINT       NOT NULL              COMMENT '冗余关联qx_route.id',
  scenic_spot_id BIGINT       NOT NULL              COMMENT '关联qx_scenic_spot.id',
  spot_order     INT          NOT NULL DEFAULT 0    COMMENT '游玩顺序',
  stay_duration  VARCHAR(20)                        COMMENT '建议停留时间',
  visit_tip      VARCHAR(256)                       COMMENT '游玩建议',
  created_at     DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  INDEX idx_rspot_day (route_day_id),
  INDEX idx_rspot_route (route_id),
  INDEX idx_rspot_spot (scenic_spot_id)
) ENGINE=InnoDB COMMENT='路线景点关联表';

-- ============================================
-- 6. 图片资产表
-- ============================================
CREATE TABLE qx_media_asset (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  biz_type   VARCHAR(20)  NOT NULL              COMMENT '业务类型:scenic/route/theme/user_trip/knowledge',
  biz_id     BIGINT       NOT NULL              COMMENT '业务主键ID',
  asset_type VARCHAR(20)  NOT NULL              COMMENT '资产类型:cover/thumb/gallery/fallback',
  url        VARCHAR(512) NOT NULL              COMMENT '图片路径',
  thumb_url  VARCHAR(512)                       COMMENT '缩略图路径',
  source     VARCHAR(128)                       COMMENT '图片来源',
  credit     VARCHAR(128)                       COMMENT '署名',
  license    VARCHAR(128)                       COMMENT '授权说明',
  width      INT                                COMMENT '宽度(px)',
  height     INT                                COMMENT '高度(px)',
  file_size  INT                                COMMENT '文件大小(字节)',
  sort_order INT          NOT NULL DEFAULT 0    COMMENT '排序',
  status     TINYINT      NOT NULL DEFAULT 1    COMMENT '1=正常 0=禁用',
  created_at DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  INDEX idx_media_biz (biz_type, biz_id),
  INDEX idx_media_type (asset_type),
  INDEX idx_media_sort (biz_type, biz_id, sort_order)
) ENGINE=InnoDB COMMENT='图片资产表';

-- ============================================
-- 7. 用户行程表 (含JSON快照, 支持AI复盘)
-- ============================================
CREATE TABLE qx_user_trip (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  user_id             BIGINT       NOT NULL              COMMENT '关联qx_user.id',
  route_id            BIGINT                             COMMENT '来源路线模板(可空,指向qx_route.id)',
  route_name          VARCHAR(128) NOT NULL              COMMENT '行程名称(快照)',
  custom_name         VARCHAR(64)                        COMMENT '用户自定义名称',
  status              VARCHAR(16)  NOT NULL DEFAULT 'upcoming' COMMENT 'upcoming/active/completed',
  day_count           INT          NOT NULL DEFAULT 1    COMMENT '天数',
  energy_level        VARCHAR(8)                         COMMENT '体力等级',
  travel_start_date   DATE                               COMMENT '出行开始日期',
  travel_end_date     DATE                               COMMENT '出行结束日期',
  route_snapshot_json JSON                               COMMENT '保存时路线模板/AI生成路线的完整快照',
  plan_snapshot_json  JSON                               COMMENT '保存时完整日程计划快照(dayPlans+spots)',
  ai_result_id        BIGINT                             COMMENT '关联qx_ai_plan_result.id(若来自AI规划)',
  started_at          DATETIME                           COMMENT '开始行程时间',
  completed_at        DATETIME                           COMMENT '完成行程时间',
  deleted             TINYINT      NOT NULL DEFAULT 0    COMMENT '逻辑删除',
  created_at          DATETIME     NOT NULL DEFAULT NOW() COMMENT '保存时间',
  updated_at          DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  INDEX idx_trip_user (user_id),
  INDEX idx_trip_route (route_id),
  INDEX idx_trip_status (status),
  INDEX idx_trip_ai_result (ai_result_id),
  INDEX idx_trip_created (created_at DESC)
) ENGINE=InnoDB COMMENT='用户行程表';

-- ============================================
-- 8. 用户行程每日安排表
-- ============================================
CREATE TABLE qx_user_trip_day (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  trip_id       BIGINT       NOT NULL               COMMENT '关联qx_user_trip.id',
  day_number    INT          NOT NULL               COMMENT '第几天',
  title         VARCHAR(128) NOT NULL               COMMENT '当天标题',
  description   TEXT                                COMMENT '当天说明',
  meals         VARCHAR(256)                        COMMENT '餐饮建议',
  accommodation VARCHAR(256)                        COMMENT '住宿建议',
  is_edited     TINYINT      NOT NULL DEFAULT 0     COMMENT '是否被用户编辑过',
  sort_order    INT          NOT NULL DEFAULT 0     COMMENT '排序',
  created_at    DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at    DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  INDEX idx_utday_trip (trip_id),
  UNIQUE INDEX idx_utday_trip_day (trip_id, day_number)
) ENGINE=InnoDB COMMENT='用户行程每日安排表';

-- ============================================
-- 9. 用户行程景点表
-- ============================================
CREATE TABLE qx_user_trip_spot (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  trip_day_id    BIGINT       NOT NULL               COMMENT '关联qx_user_trip_day.id',
  trip_id        BIGINT       NOT NULL               COMMENT '冗余关联qx_user_trip.id',
  scenic_spot_id BIGINT                              COMMENT '关联qx_scenic_spot.id(可空)',
  spot_name      VARCHAR(100) NOT NULL               COMMENT '景点名称(快照)',
  spot_order     INT          NOT NULL DEFAULT 0     COMMENT '游玩顺序',
  created_at     DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  INDEX idx_utspot_day (trip_day_id),
  INDEX idx_utspot_trip (trip_id)
) ENGINE=InnoDB COMMENT='用户行程景点表';

-- ============================================
-- 10. 行程安全清单表
-- ============================================
CREATE TABLE qx_trip_safety_item (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  trip_id    BIGINT       NOT NULL              COMMENT '关联qx_user_trip.id',
  item_text  VARCHAR(256) NOT NULL              COMMENT '清单项文字',
  is_checked TINYINT      NOT NULL DEFAULT 0    COMMENT '是否已勾选',
  sort_order INT          NOT NULL DEFAULT 0    COMMENT '排序',
  created_at DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  INDEX idx_safety_trip (trip_id)
) ENGINE=InnoDB COMMENT='行程安全清单表';

-- ============================================
-- 11. 行程复盘评价表
-- ============================================
CREATE TABLE qx_trip_review (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  trip_id     BIGINT       NOT NULL              COMMENT '关联qx_user_trip.id(一对一)',
  rating      TINYINT      NOT NULL DEFAULT 0    COMMENT '评分 1-5',
  highlights  VARCHAR(500)                       COMMENT '本次亮点',
  regrets     VARCHAR(500)                       COMMENT '遗憾与不足',
  next_advice VARCHAR(500)                       COMMENT '下次建议',
  created_at  DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at  DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  UNIQUE INDEX idx_review_trip (trip_id)
) ENGINE=InnoDB COMMENT='行程复盘评价表';

-- ============================================
-- 12. AI规划请求表 (完整用户输入+画像+上下文)
-- ============================================
CREATE TABLE qx_ai_plan_request (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  user_id       BIGINT                             COMMENT '关联qx_user.id',
  session_id    VARCHAR(64)                        COMMENT '会话标识',
  input_tags    JSON                               COMMENT '用户选择的兴趣标签',
  input_days    INT                                COMMENT '出行天数',
  input_budget  VARCHAR(32)                        COMMENT '预算',
  input_crowd   VARCHAR(32)                        COMMENT '出行人群',
  input_energy  VARCHAR(8)                         COMMENT '体力偏好',
  input_pace    VARCHAR(8)                         COMMENT '游览节奏',
  input_json    JSON                               COMMENT '完整用户输入JSON',
  profile_json  JSON                               COMMENT '完整画像结果JSON',
  context_json  JSON                               COMMENT '多轮规划上下文(预留)',
  status        VARCHAR(16) NOT NULL DEFAULT 'pending' COMMENT 'pending/processing/completed/failed',
  error_message TEXT                               COMMENT '错误信息',
  elapsed_ms    INT                                COMMENT '耗时(毫秒)',
  created_at    DATETIME    NOT NULL DEFAULT NOW() COMMENT '创建时间',
  INDEX idx_aipr_user (user_id),
  INDEX idx_aipr_status (status),
  INDEX idx_aipr_session (session_id)
) ENGINE=InnoDB COMMENT='AI规划请求表';

-- ============================================
-- 13. AI规划结果表 (完整原始+结构化+错误JSON, 支持复盘)
-- ============================================
CREATE TABLE qx_ai_plan_result (
  id                    BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  request_id            BIGINT       NOT NULL       COMMENT '关联qx_ai_plan_request.id',
  route_name            VARCHAR(128)                COMMENT 'AI生成的路线名称',
  route_json            JSON                        COMMENT '小程序可直接渲染的路线结构',
  raw_result_json       JSON                        COMMENT '模型原始返回JSON(用于复盘)',
  normalized_result_json JSON                       COMMENT '后端清洗后的结构化结果',
  error_json            JSON                        COMMENT '失败时保存完整错误上下文',
  adopted_trip_id       BIGINT                      COMMENT '用户采纳后生成的qx_user_trip.id',
  is_adopted            TINYINT      NOT NULL DEFAULT 0 COMMENT '是否被用户采纳',
  model_name            VARCHAR(64)                 COMMENT '模型名称(预留)',
  prompt_tokens         INT                         COMMENT '输入token数(预留)',
  completion_tokens     INT                         COMMENT '输出token数(预留)',
  elapsed_ms            INT                         COMMENT 'AI调用耗时(毫秒)',
  created_at            DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  INDEX idx_aipres_req (request_id),
  INDEX idx_aipres_adopted (is_adopted),
  INDEX idx_aipres_trip (adopted_trip_id)
) ENGINE=InnoDB COMMENT='AI规划结果表';

-- ============================================
-- 14. 知识库文章表
-- ============================================
CREATE TABLE qx_knowledge_article (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  article_code VARCHAR(32)  NOT NULL               COMMENT '文章编码, e.g. k1',
  question     VARCHAR(256) NOT NULL               COMMENT '问题',
  answer       TEXT         NOT NULL               COMMENT '回答',
  category     VARCHAR(20)  NOT NULL               COMMENT '分类:scenic/transport/food/culture/tips',
  sort_order   INT          NOT NULL DEFAULT 0     COMMENT '排序',
  status       TINYINT      NOT NULL DEFAULT 1     COMMENT '1=发布 0=下架',
  deleted      TINYINT      NOT NULL DEFAULT 0     COMMENT '逻辑删除',
  created_at   DATETIME     NOT NULL DEFAULT NOW() COMMENT '创建时间',
  updated_at   DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  UNIQUE INDEX idx_ka_code (article_code),
  INDEX idx_ka_category (category),
  INDEX idx_ka_status (status)
) ENGINE=InnoDB COMMENT='知识库文章表';

-- ============================================
-- 15. 知识库关联关系表
-- ============================================
CREATE TABLE qx_knowledge_relation (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  article_id BIGINT      NOT NULL              COMMENT '关联qx_knowledge_article.id',
  rel_type   VARCHAR(20) NOT NULL              COMMENT '关联类型:scenic_spot/route/theme/safety/culture/tip',
  rel_id     BIGINT      NOT NULL              COMMENT '关联业务ID',
  created_at DATETIME    NOT NULL DEFAULT NOW() COMMENT '创建时间',
  INDEX idx_kr_article (article_id),
  INDEX idx_kr_rel (rel_type, rel_id)
) ENGINE=InnoDB COMMENT='知识库关联关系表';
