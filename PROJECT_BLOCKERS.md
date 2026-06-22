# 黔行智导 · 项目阻塞记录

## Redis 未真实启用

- 模块：AI 线路草稿缓存
- 状态：pom.xml 已有 Redis 依赖，当前 ConcurrentHashMap 内存降级（commit c4ecef9）
- 风险：重启草稿丢失，多实例不共享
- 恢复条件：安装 Redis，配置 REDIS_HOST/PORT/PASSWORD/DATABASE
- 后续验证：Redis key 写入/读取/TTL/confirm 删除
