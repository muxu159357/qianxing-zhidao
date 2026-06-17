-- ============================================================
-- V2: 新增后台管理预留 + 天气模块基础表
-- 黔行智导 · Flyway Migration
-- ============================================================

-- 16. 后台管理用户表（预留）
CREATE TABLE IF NOT EXISTS qx_admin_user (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  username      VARCHAR(50)  NOT NULL               COMMENT '用户名',
  password_hash VARCHAR(255) NOT NULL               COMMENT '密码哈希(bcrypt)',
  display_name  VARCHAR(50)                         COMMENT '显示名称',
  role          VARCHAR(20)  NOT NULL DEFAULT 'editor' COMMENT '角色:admin/editor',
  status        TINYINT      NOT NULL DEFAULT 1     COMMENT '1=正常 0=禁用',
  deleted       TINYINT      NOT NULL DEFAULT 0     COMMENT '逻辑删除',
  sort_order    INT          NOT NULL DEFAULT 0     COMMENT '排序',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE INDEX idx_admin_username (username),
  INDEX idx_admin_role (role),
  INDEX idx_admin_status (status)
) ENGINE=InnoDB COMMENT='后台管理用户表';

-- 17. 天气地点配置表
CREATE TABLE IF NOT EXISTS qx_weather_location (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  location_code   VARCHAR(32)  NOT NULL              COMMENT '地点编码',
  location_name   VARCHAR(100) NOT NULL              COMMENT '地点名称(城市/景区)',
  location_type   VARCHAR(20)  NOT NULL              COMMENT '类型:city/scenic',
  scenic_spot_id  BIGINT                             COMMENT '关联qx_scenic_spot.id(若为景区)',
  region_code     VARCHAR(6)                         COMMENT '行政区划代码',
  latitude        DECIMAL(10,7)                      COMMENT '纬度',
  longitude       DECIMAL(10,7)                      COMMENT '经度',
  provider_code   VARCHAR(64)                        COMMENT '天气服务商的地点编码',
  update_enabled  TINYINT      NOT NULL DEFAULT 1    COMMENT '是否启用天气更新',
  update_interval_min INT      NOT NULL DEFAULT 60   COMMENT '更新间隔(分钟)',
  status          TINYINT      NOT NULL DEFAULT 1    COMMENT '1=正常 0=禁用',
  deleted         TINYINT      NOT NULL DEFAULT 0    COMMENT '逻辑删除',
  sort_order      INT          NOT NULL DEFAULT 0    COMMENT '排序',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE INDEX idx_wl_code (location_code),
  INDEX idx_wl_type (location_type),
  INDEX idx_wl_scenic (scenic_spot_id),
  INDEX idx_wl_enabled (update_enabled)
) ENGINE=InnoDB COMMENT='天气地点配置表';

-- 18. 景区天气数据表
CREATE TABLE IF NOT EXISTS qx_scenic_weather (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  location_id     BIGINT       NOT NULL              COMMENT '关联qx_weather_location.id',
  scenic_spot_id  BIGINT                             COMMENT '冗余关联qx_scenic_spot.id',
  weather_date    DATE         NOT NULL              COMMENT '天气日期',
  temperature_high DECIMAL(4,1)                      COMMENT '最高温度(℃)',
  temperature_low  DECIMAL(4,1)                      COMMENT '最低温度(℃)',
  weather_desc    VARCHAR(64)                        COMMENT '天气描述(晴/多云/雨等)',
  weather_icon    VARCHAR(32)                        COMMENT '天气图标代码',
  wind_direction  VARCHAR(16)                        COMMENT '风向',
  wind_level      VARCHAR(8)                         COMMENT '风力等级',
  humidity        INT                                COMMENT '湿度(%)',
  visibility      INT                                COMMENT '能见度(m)',
  uv_index        INT                                COMMENT '紫外线指数',
  tips            VARCHAR(256)                       COMMENT '出行提示',
  raw_json        JSON                               COMMENT '天气API原始返回JSON',
  provider        VARCHAR(32)                        COMMENT '天气数据来源',
  fetched_at      DATETIME                           COMMENT '数据获取时间',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_sw_location_date (location_id, weather_date),
  INDEX idx_sw_scenic_date (scenic_spot_id, weather_date),
  INDEX idx_sw_fetched (fetched_at)
) ENGINE=InnoDB COMMENT='景区天气数据表';
