-- V5: 天气地点默认关闭更新，需后台手动开启
UPDATE qx_weather_location SET update_enabled = 0 WHERE update_enabled = 1;
