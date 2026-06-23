# 黔行智导 — Claude 跨电脑开发交接文档

> 生成: 2026-06-23 | 仓库: github.com/muxu159357/qianxing-zhidao | 分支: main

## 1. 项目概览

**黔行智导：贵州山地旅游 AI 个性化导览平台**

组成: Spring Boot 3.4 后端 + Vue 3/Vite 后台 Web + 微信小程序 + AI助手/路线草稿 + 天气 + Redis准备

## 2. 目录结构

| 目录 | 用途 |
|------|------|
| `backend/` | Spring Boot 后端 (Java21, Maven, MySQL, Flyway) |
| `src/` | Vue 3 前端 (后台管理页面) |
| `miniprogram/` | 微信原生小程序 |
| `scripts/` | PowerShell 检查脚本 |
| `docs/` | 上线/部署/联调文档 |

## 3. 阶段进度 (全部代码级完成)

| 阶段 | 内容 | Commit |
|------|------|--------|
| 6-B | 景点管理 CRUD | `b46fbc1` |
| 6-C | 路线管理 CRUD | `dad8cb9` |
| 6-D | 路线日程+景点关联 | `050ddf3` |
| 6-D-V | 构建修复 | `87d1ff2` |
| 6-E | 知识库 CRUD | `020c75b` |
| 6-F | 媒体管理 | `1417840` |
| 6-G | 天气管理 | `b526174` |
| 6-H | 行程管理(只读) | `4315b56` |
| 7-B | 检查脚本 | `ace2486` |
| 7-C | Redis配置 | `540c6d8` |
| 8 | 上线文档 | `1245c96` |
| 7-A | 联调清单 | `c0553d0` |

## 4. 后台菜单

全部可用: 工作台/景点/路线/日程/知识库/媒体/天气/行程
建设中: AI记录/系统设置 (后端就绪)

## 5. 阻塞项

1. 管理员账号未初始化 → 配 ADMIN_BOOTSTRAP_* → 不阻止开发
2. Redis未启用 → 草稿内存降级 → 不阻止开发
3. AI/天气Key未配置 → 降级可用 → 不阻止开发
4. 媒体上传需OSS/S3 → 仅URL管理 → 不阻止开发
5. 真机/域名/HTTPS → 需用户操作 → 不阻止开发

## 6. 环境变量 (仅变量名)

SPRING_PROFILES_ACTIVE, SERVER_PORT, JWT_SECRET(prod需>=32字节), DB_HOST/PORT/NAME/USERNAME/PASSWORD, REDIS_HOST/PORT/PASSWORD/DATABASE, AI_API_KEY/BASE_URL/MODEL, WEATHER_API_KEY/PROVIDER, ADMIN_BOOTSTRAP_ENABLED/USERNAME/PASSWORD/DISPLAY_NAME

> 示例: backend/.local/local-env.example.ps1 (占位符, gitignored)

## 7. 启动命令

```powershell
# 后端
cd backend
. .\.local\local-env.ps1
mvn clean compile && mvn test && mvn spring-boot:run
# 健康: GET /api/health → {"code":0}

# 前端
npm install && npm run dev     # :5173
npm run build                  # dist/

# 小程序
# 微信开发者工具 → 导入根目录 → 勾选不校验域名 → 编译
```

## 8. 关键配置

- **Vite proxy**: `/api` → `:8080` (vite.config.ts)
- **后台入口**: `/admin/login`, token: `qianxing_admin_token`
- **小程序根**: `project.config.json` → `miniprogramRoot: "miniprogram/"`
- **小程序BASE_URL**: `http://localhost:8080` (api.js)
- **tabBar**: 首页/AI助手/我的行程
- **JWT守卫**: admin↔app token 双向隔离

## 9. 小程序禁忌

**禁用词**: 测试/Mock/Demo/临时/TODO/AI导游/实时天气/定位/监测/预警
**可用**: AI助手/AI伴游/智能规划/天气参考/山地提醒/位置授权/今天怎么玩
**WXSS禁**: var()/:root/>选择器/中文class
**跳转**: tabBar→switchTab, 非tabBar→navigateTo

## 10. P0修复历史

| 问题 | Commit |
|------|--------|
| app.json页面缺失 | `6ac8cd4` (根级project.config.json) |
| guide.js Missing semicolon | `adb928e` (if/else块级) |
| YAML重复spring键 | `509855d` (合并Redis配置) |
| AI草稿JSON保存失败 | `8847ff5` (writeValueAsString) |
| 行程删除不调API | `605381f` (远程删除) |
| Vite代理缺失 | `5a4723e` (proxy配置) |

## 11. 脚本

`scripts/check-backend-health.ps1` - 后端健康 (不打印敏感信息)
`scripts/check-admin-readiness.ps1` - 管理员就绪 (不打印密码)
`scripts/check-miniprogram-files.ps1` - 小程序文件完整性

## 12. Claude开发规则

1. 先跑验收，不盲目新增功能
2. P0优先于功能
3. 不提交真实密钥，只用占位符
4. 不打印 token/password/JWT_SECRET/passwordHash
5. 软删除优先，不做 DROP/TRUNCATE
6. 所有改动 build/test
7. commit用中文，push到main
8. 代码级完成≠真实验收

## 13. 新电脑接手

```powershell
git clone git@github.com:muxu159357/qianxing-zhidao.git
cd qianxing-zhidao
.\scripts\check-miniprogram-files.ps1
cd backend && mvn clean compile && mvn test
cd .. && npm install && npm run build
# 微信开发者工具 → 导入根目录 → 编译
```

## 14. 下一步

**先跑本地真实验收，不新增功能:**
1. 后端启动 + 管理员初始化
2. 后台页面逐项打开
3. 小程序编译 + 核心流程联调
4. Redis/AI/天气/域名按需配置
