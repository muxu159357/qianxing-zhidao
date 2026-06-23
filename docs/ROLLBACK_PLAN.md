# 黔行智导 · 回滚方案

## 后端回滚
- `git checkout <上一稳定commit>`
- `mvn clean package`
- 重启服务

## 数据库回滚
- Migration 不可随意回滚
- 需DBA单独制定SQL
- 优先回滚配置而非数据

## 小程序回滚
- 微信公众平台→版本管理→回退到上一审核版本
- 审核通过前不能发布新版本

## 后台Web回滚
- 回滚到上一版 dist 目录
- 或 `git checkout <上一commit>` + `npm run build`

## 配置回滚
- 优先回滚环境变量
- Redis异常→临时memory fallback (不推荐生产长期使用)
