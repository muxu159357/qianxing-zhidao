# 黔行智导 · 后端本地启动与排障指南

> 版本：1.0 | 2026-06-18
> 适用环境：Windows + IntelliJ IDEA + MySQL 8.0

---

## 一、启动前检查清单

| 检查项 | 命令/方法 | 期望结果 |
|--------|----------|---------|
| Java 版本 | `java -version` | 21.x |
| MySQL 运行中 | `mysqladmin -u root -p ping` | `mysqld is alive` |
| 端口 8080 空闲 | `netstat -ano \| findstr :8080` | 无输出 |
| 数据库存在 | `mysql -u root -p -e "USE qianxing_zhidao; SHOW TABLES;"` | 19 张表 |

---

## 二、IDEA 环境变量配置

### 配置位置

```
Run → Edit Configurations
→ 选择 ZhidaoApplication
→ Environment variables 栏
```

### 必填变量

```
DB_USERNAME=root;DB_PASSWORD=你的MySQL密码;JWT_SECRET=你的32位以上随机字符串
```

### 必填变量说明

| 变量 | 用途 | 来源 |
|------|------|------|
| `DB_USERNAME` | MySQL 用户名 | 本地 MySQL 安装时设置，通常为 `root` |
| `DB_PASSWORD` | MySQL 密码 | `mysql -u root -p` 登录时输入的密码 |
| `JWT_SECRET` | JWT 签名密钥 | **自定义**，32 位以上随机字符串 |

### 可选变量（不填不影响后端启动和公开接口）

| 变量 | 用途 | 缺失时行为 |
|------|------|-----------|
| `WX_APPID` | 微信小程序 AppID | 登录接口返回 501 |
| `WX_SECRET` | 微信小程序 Secret | 登录接口返回 501 |
| `LLM_API_BASE_URL` | 大模型 API 地址 | AI 使用本地规则回答 |
| `LLM_API_KEY` | 大模型 API Key | AI 使用本地规则回答 |
| `LLM_MODEL` | 大模型名称 | 使用默认 |
| `WEATHER_API_KEY` | 天气 API Key | 刷新接口返回 501 |

### IDEA 完整配置示例

```
DB_USERNAME=root;DB_PASSWORD=your_real_password;JWT_SECRET=my-qianxing-jwt-secret-key-at-least-32-chars
```

---

## 三、端口 8080 被占用处理

### 查看占用

PowerShell：

```powershell
netstat -ano | findstr :8080
```

输出示例：`TCP 0.0.0.0:8080 ... LISTENING 12345`（12345 为 PID）

### 查看进程名

```powershell
tasklist /FI "PID eq 12345"
```

### 结束进程（确认非重要服务后）

```powershell
taskkill /PID 12345 /F
```

### 替代方案：临时换端口

在 IDEA 启动配置的 Program arguments 中填入：

```
--server.port=8081
```

**注意**：如果改了后端端口，小程序端 `utils/api.js` 中的 `BASE_URL` 必须同步改为 `http://localhost:8081`。优先建议释放 8080。

---

## 四、微信登录变量获取

`WX_APPID` 和 `WX_SECRET` 来源：

```
微信公众平台 → 小程序后台 → 开发管理 → 开发设置
```

安全要求：
- `WX_SECRET` 只能放后端环境变量
- 不能写入 `miniprogram/` 目录
- 不能提交 Git

---

## 五、启动验证

IDEA 控制台看到以下输出表示启动成功：

```
Started ZhidaoApplication in X.XXX seconds
```

验证命令：

```bash
curl http://localhost:8080/api/health
# {"code":0,"message":"ok","data":"qianxing-zhidao backend is running"}
```

浏览器打开 Swagger 文档：

```
http://localhost:8080/swagger-ui.html
```

---

## 六、常见排障

| 问题 | 原因 | 解决 |
|------|------|------|
| `Access denied for user 'root'` | 数据库密码不对 | 检查 `DB_PASSWORD` 环境变量 |
| `Unknown database 'qianxing_zhidao'` | 数据库不存在 | 创建数据库 |
| `Port 8080 was already in use` | 端口占用 | 参考第三节 |
| JWT 相关报错 | `JWT_SECRET` 未设置 | 在 IDEA 环境变量中添加 |
| Flyway 报错 | migration 冲突 | 已配置 `baseline-on-migrate: true` |

---

## 七、安全风险提醒

### application.yml 中的默认值

当前 `application.yml` 第 19 行包含：

```yaml
appid: ${WX_APPID:wxaba2cf77773a606f}
```

`wxaba2cf77773a606f` 作为默认值硬编码在文件中。如果这是真实有效的 AppID，建议改为空默认值：

```yaml
appid: ${WX_APPID:}
```

避免将有效 AppID 暴露在版本控制中。

### application-dev.yml 中的默认密码

如果 `application-dev.yml` 中包含 `${DB_PASSWORD:真实密码}` 模式，建议保留空白默认值（`${DB_PASSWORD:}`），通过 IDEA 环境变量注入真实密码。

### 密钥安全规则

1. 真实密钥一律不提交 Git
2. 通过 IDEA 环境变量或系统环境变量注入
3. `application-local.yml` 可写入真实值（已加入 `.gitignore`）
4. 小程序端 `api.js` 不包含任何密钥
