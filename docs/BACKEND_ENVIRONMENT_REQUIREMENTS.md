# 黔行智导 · 后端环境变量与配置要求

> Version: 1.1 | 2026-06-18 | 后端基本完成 + IDEA 配置说明

## 一、概述

后端采用 Spring Boot 3.4.x，配置通过 `application.yml` + `application-dev.yml` + 环境变量注入。
所有敏感信息（密钥、密码）通过环境变量或 `application-local.yml` 配置，不提交 Git。

详见配套文档：`docs/BACKEND_LOCAL_RUN_GUIDE.md`（本地启动与排障）

## 二、必须配置（否则后端无法启动或功能不可用）

| 变量 | 用途 | 配置位置 | 默认值 | 必填 |
|------|------|---------|--------|------|
| `DB_USERNAME` | MySQL 用户名 | 环境变量 / application-local.yml | `root` | 是 |
| `DB_PASSWORD` | MySQL 密码 | 环境变量 / application-local.yml | 空 | 是 |
| `JWT_SECRET` | JWT 签名密钥（至少256位） | 环境变量 / application-local.yml | 空 | 是* |

*JWT_SECRET 不配置时后端可启动，但登录功能不可用。

## 三、条件配置（对应功能需要时才配）

| 变量 | 用途 | 用途模块 | 缺失时行为 |
|------|------|---------|-----------|
| `WX_APPID` | 微信小程序 AppID | 微信登录 | 返回 501 配置缺失错误 |
| `WX_SECRET` | 微信小程序 Secret | 微信登录 | 返回 501 配置缺失错误 |
| `LLM_API_BASE_URL` | 大模型 API 地址 | AI 问答/规划 | 使用本地规则回答 |
| `LLM_API_KEY` | 大模型 API Key | AI 问答/规划 | 使用本地规则回答 |
| `LLM_MODEL` | 大模型名称 | AI 问答/规划 | 使用默认 |
| `WEATHER_API_BASE_URL` | 天气 API 地址 | 天气查询 | 返回 501 配置缺失 |
| `WEATHER_API_KEY` | 天气 API Key | 天气查询 | 返回 501 配置缺失 |
| `WEATHER_PROVIDER` | 天气服务商 | 天气查询 | 返回 501 配置缺失 |
| `WEATHER_UPDATE_ENABLED` | 是否启用天气更新 | 天气刷新 | 默认 false |

## 四、配置方式

### 方式一：IntelliJ IDEA 环境变量（推荐本地开发）

配置位置：

```
Run → Edit Configurations → ZhidaoApplication
→ Environment variables 栏
```

填写内容（分号分隔）：

```
DB_USERNAME=root;DB_PASSWORD=你的MySQL密码;JWT_SECRET=你的32位以上随机字符串
```

可选追加：

```
WX_APPID=wx_xxx;WX_SECRET=xxx;LLM_API_KEY=sk-xxx;WEATHER_API_KEY=xxx
```

### 方式二：系统环境变量（推荐 CI/CD）

```bash
export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_SECRET=your_256_bit_secret_key_here
export WX_APPID=wx_your_appid
export WX_SECRET=your_wx_secret
```

### 方式三：application-local.yml（高级用户）

```bash
cp backend/src/main/resources/application-local.yml.template backend/src/main/resources/application-local.yml
# 编辑填入真实值
# IDEA 启动参数：--spring.profiles.active=local
```

`application-local.yml` 已加入 `.gitignore`，不会被提交。

## 五、数据库配置

- **数据库名**：`qianxing_zhidao`
- **字符集**：`utf8mb4`
- **JDBC URL**：`jdbc:mysql://localhost:3306/qianxing_zhidao`
- **Flyway**：已启用 `baseline-on-migrate`，首次启动自动 baseline 已有表
- **已有表**：15 张 `qx_*` 基础表
- **新增表**：3 张（`qx_admin_user`, `qx_weather_location`, `qx_scenic_weather`）通过 V2 migration

## 六、启动验证

```bash
cd backend
mvn spring-boot:run

# 或
java -jar target/zhidao-0.1.0.jar
```

验证：
```bash
curl http://localhost:8080/api/health
# {"code":0,"message":"ok","data":"qianxing-zhidao backend is running"}

curl http://localhost:8080/swagger-ui.html
# OpenAPI 文档界面

curl http://localhost:8080/v3/api-docs
# OpenAPI JSON
```

## 七、API 前缀说明

| 前缀 | 鉴权 | 用途 |
|------|------|------|
| `/api/health` | 公开 | 健康检查 |
| `/api/app/auth/**` | 公开 | 登录认证 |
| `/api/app/scenic/**` | 公开 | 景点数据 |
| `/api/app/routes/**` | 公开 | 路线数据 |
| `/api/app/media/**` | 公开 | 图片资产 |
| `/api/app/knowledge/**` | 公开 | 知识库 |
| `/api/app/weather/**` | 公开 | 天气查询 |
| `/api/app/user/**` | 需登录 | 用户信息 |
| `/api/app/trips/**` | 需登录 | 用户行程 |
| `/api/app/ai/**` | 需登录 | AI规划/问答 |
| `/swagger-ui/**` | 公开 | API 文档 |
| `/v3/api-docs/**` | 公开 | OpenAPI JSON |

## 八、已知配置风险

### application.yml 中的 WX_APPID 默认值

当前 `application.yml` 第 19 行：

```yaml
appid: ${WX_APPID:wxaba2cf77773a606f}
```

其中 `wxaba2cf77773a606f` 作为默认值硬编码。如果这是真实有效的 AppID，存在泄露风险。

建议改为空默认值：

```yaml
appid: ${WX_APPID:}
```

通过 IDEA 环境变量注入真实值。

### application-dev.yml 中的 DB_PASSWORD 默认值

如果 `application-dev.yml` 中写入了真实密码作为默认值（如 `${DB_PASSWORD:123456}`），建议保持默认值为空（`${DB_PASSWORD:}`），通过 IDEA 环境变量注入真实密码。

## 九、密钥安全规则

- 绝不提交 `application-local.yml` 到 Git
- 绝不提交真实 `JWT_SECRET`、`WX_APPID`、`WX_SECRET` 等密钥
- 小程序端 `miniprogram/utils/api.js` 仅包含 `BASE_URL`，不包含任何密钥
- 生产环境使用环境变量注入
- 当前为本地开发阶段，无生产部署
