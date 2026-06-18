# 黔行智导 · 部署检查清单

> 版本 1.0 | 2026-06-19

## 环境要求
- Java 21 · MySQL 8.0+ · Maven 3.9+ · (可选) Redis 7+

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| DB_USERNAME | 是 | MySQL 用户名 |
| DB_PASSWORD | 是 | MySQL 密码 |
| JWT_SECRET | 是 | 32位+随机字符串 |
| WX_APPID | 否 | 微信小程序AppID |
| WX_SECRET | 否 | 微信小程序Secret |
| LLM_API_BASE_URL | 否 | 大模型API地址 |
| LLM_API_KEY | 否 | 大模型API Key |
| WEATHER_API_KEY | 否 | 天气API Key |

## 后端启动
```bash
cd backend && mvn clean package -DskipTests && java -jar target/zhidao-0.1.0.jar
```

## 小程序部署
1. 微信开发者工具打开 `miniprogram/`
2. `project.config.json` appid 已填写
3. `utils/api.js` BASE_URL 改为生产地址
4. 上传 → 提交审核

## Web 前端
```bash
npm run build  # 输出 dist/
```

## 数据库
Flyway 首次启动自动 baseline + migration。V1 baseline → V2 admin/weather 表 → V3 seed 数据。

## 验证
- [ ] `/api/health` 200
- [ ] `/api/app/scenic/spots` 有数据
- [ ] 小程序可登录
- [ ] AI 对话正常
- [ ] 行程保存/查看正常
