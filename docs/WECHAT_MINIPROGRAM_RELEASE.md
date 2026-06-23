# 黔行智导 · 微信小程序发布说明

## 导入目录
`C:\Maxwell\qianxing-zhidao\` (根级 project.config.json 有 miniprogramRoot)

## request 合法域名配置
微信公众平台 → 开发管理 → 开发设置 → 服务器域名 → request 合法域名
- 必须 HTTPS
- 不能 localhost 或 IP+http
- 修改后 DevTools 详情→域名信息→刷新

## 本地联调
- BASE_URL = http://localhost:8080
- 勾选: 不校验合法域名、web-view、TLS版本及HTTPS证书

## 真机预览
- BASE_URL = http://192.168.x.x:8080
- 同WiFi + Windows防火墙放行8080

## 正式发布
- BASE_URL: HTTPS后端域名
- 公共平台配置后上传版本→提交审核
- 审核通过后发布
