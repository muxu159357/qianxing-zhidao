-- V4: 为已有景点生成天气地点配置
INSERT IGNORE INTO qx_weather_location (location_code, location_name, location_type, scenic_spot_id, provider_code, update_enabled, sort_order, status)
SELECT CONCAT('scenic-', spot_code), name, 'scenic', id, NULL, 1, sort_order, 1 FROM qx_scenic_spot WHERE status = 1;
