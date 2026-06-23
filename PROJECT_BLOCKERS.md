# 黔行智导 · 项目阻塞记录

## 后台管理员账号 (待用户操作)
- 恢复: 配置 ADMIN_BOOTSTRAP_* 环境变量后重启后端
- 见: backend/.local/local-env.example.ps1

## Redis 未真实启用
- AI草稿内存缓存，重启丢失，多实例不共享
- 恢复: 安装Redis，配置REDIS_HOST/PORT/PASSWORD

## AI/天气 API Key 未配置
- 缺失时降级可用，不阻塞主流程
- 恢复: 获取Key后配置环境变量

## 登录速率限制待实现
## 媒体上传需 OSS/S3 (当前仅URL管理)
## 真机完整联调待用户执行
## npm run build 待用户本地确认
## 小程序待 DevTools 重新编译确认

## 上线风险
1. 管理员未初始化→后台无法登录
2. Redis未启用→草稿重启丢失
3. AI/天气Key缺失→能力降级
4. request合法域名未配置→小程序接口失败
5. HTTPS证书异常→请求失败
6. Migration未执行→启动失败
7. 媒体上传缺OSS→仅URL管理
8. 速率限制未实现
9. 真机联调未执行

## 回滚方案
- 后端: git checkout 上一稳定commit
- DB migration: 不可随意回滚，需DBA
- 小程序: 回退上一审核版本
- 配置: 优先回滚环境变量
- Redis异常: 临时memory fallback(不推荐长期)

详见: docs/ROLLBACK_PLAN.md
