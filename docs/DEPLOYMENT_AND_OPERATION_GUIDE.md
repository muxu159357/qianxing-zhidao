# 部署与运维指南

## 部署前检查
- [ ] Java 21 + MySQL 8.0 + Redis 可用
- [ ] 域名已备案 + HTTPS 证书
- [ ] 小程序合法域名已配置
- [ ] AI Key / 天气 Key 已申请
- [ ] 生产环境变量已配置(不提交Git)

## 生产环境变量
```bash
export DB_URL=jdbc:mysql://<host>:3306/qianxing_zhidao
export DB_USERNAME=<user>
export DB_PASSWORD=<password>
export JWT_SECRET=<32char-random>
export AI_API_KEY=<api-key>
export WEATHER_API_KEY=<api-key>
```

## 构建
```powershell
npm run build          # → dist/
cd backend && mvn package -DskipTests
```

## Nginx
```nginx
server {
    listen 443 ssl;
    server_name admin.example.com;
    root /var/www/admin;
    index index.html;
    location /api/ { proxy_pass http://127.0.0.1:8080; }
    location / { try_files $uri /index.html; }
}
```

## 小程序发布前
- [ ] 合法域名配置完成
- [ ] HTTPS 有效
- [ ] 无外部图片热链
- [ ] 无 WXSS 编译错误

## 数据库
```sql
CREATE DATABASE qianxing_zhidao CHARACTER SET utf8mb4;
```

## 安全
- 不提交 `.env`/`.local`/`local-env.ps1`
- JWT_SECRET ≥ 32 字符
- 生产关闭 Swagger
- 日志不输出敏感字段

## 验收
- [ ] 后台可登录
- [ ] CRUD 正常
- [ ] 小程序三页可访问
- [ ] AI 对话正常
- [ ] HTTPS 有效
