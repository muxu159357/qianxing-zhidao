# 新电脑环境搭建指南

## 1. 克隆项目
```powershell
git clone https://github.com/muxu159357/qianxing-zhidao.git
cd qianxing-zhidao
```

## 2. 必备工具
| 工具 | 版本 | 检查 |
|------|------|------|
| Node.js | 18+ | `node -v` |
| Java JDK | 21 | `java -version` |
| Maven | 3.8+ | `mvn -v` |
| Git | 2.40+ | `git --version` |
| 微信开发者工具 | 最新 | 官网下载 |

## 3. 安装依赖
```powershell
npm install
cd backend && mvn dependency:resolve && cd ..
```

## 4. 本地环境变量
创建 `backend\.local\local-env.ps1` (已在.gitignore):
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/qianxing_zhidao"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="<your-password>"
$env:JWT_SECRET="<your-secret>"
$env:AI_API_KEY="<your-api-key>"
$env:WEATHER_API_KEY="<your-weather-key>"
```

## 5. MySQL
```sql
CREATE DATABASE qianxing_zhidao CHARACTER SET utf8mb4;
```
后端启动自动建表 (JPA ddl-auto)。

## 6. Redis (可选)
用于缓存，无 Redis 时降级运行。

## 7. 微信开发者工具
- 导入 `miniprogram/` 目录
- AppID 在 `project.config.json`

## 8. Claude Code 接手
第一条指令:
> 请先读取 CLAUDE_PROJECT_HANDOFF.md 和 docs/NEW_COMPUTER_SETUP.md

## 9. 启动顺序
```powershell
# 后端
cd backend && . .\.local\local-env.ps1 && mvn spring-boot:run

# 前端
npm run dev

# 小程序 → 微信开发者工具导入 miniprogram/
```

## 10. 常见问题
| 问题 | 解决 |
|------|------|
| Maven慢 | 配置阿里云镜像 |
| MySQL连接失败 | 检查local-env.ps1密码 |
| 端口冲突 | 后端8080/前端5173 |
| WXSS编译错误 | 检查无`*`/`var()`/`:root` |
