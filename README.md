# 黔行智导：贵州山地旅游 AI 个性化导览平台

面向贵州山地旅游的 AI 伴游与安全守护平台，基于大语言模型提供个性化路线推荐、AI 问答、行程管理和安全出行服务。

## 技术栈
| 子系统 | 技术 |
|--------|------|
| 后端 | Spring Boot + MyBatis-Plus + MySQL |
| 后台管理 | Vue 3 + Vite + TypeScript + Element Plus |
| 微信小程序 | 微信原生 WXML/WXSS/JS |

## 当前状态
**代码级开发基本完成，待真实验收。** 后端 API、后台管理、小程序前端均已完成基础功能开发和视觉统一。

## 子系统
- **后端** (`backend/`): REST API · MyBatis-Plus + MySQL · JWT 认证
- **后台管理** (`src/`): Dashboard + 7 管理页 · Figma 视觉 → [验收清单](docs/ADMIN_FIGMA_VISUAL_QA.md)
- **小程序** (`miniprogram/`): 14 页面 · Stitch 视觉 → [验收清单](docs/MINIPROGRAM_STITCH_VISUAL_QA.md)

## 文档导航
| 文档 | 说明 |
|------|------|
| [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) | 项目进度 |
| [CLAUDE_PROJECT_HANDOFF.md](CLAUDE_PROJECT_HANDOFF.md) | Claude 接手入口 |
| [docs/NEW_COMPUTER_SETUP.md](docs/NEW_COMPUTER_SETUP.md) | 换电脑环境搭建 |
| [docs/LOCAL_DEV_ONE_CLICK_START.md](docs/LOCAL_DEV_ONE_CLICK_START.md) | 本地启动 |
| [docs/DEPLOYMENT_AND_OPERATION_GUIDE.md](docs/DEPLOYMENT_AND_OPERATION_GUIDE.md) | 部署运维 |
| [docs/ADMIN_FIGMA_VISUAL_QA.md](docs/ADMIN_FIGMA_VISUAL_QA.md) | 后台验收 |
| [docs/MINIPROGRAM_STITCH_VISUAL_QA.md](docs/MINIPROGRAM_STITCH_VISUAL_QA.md) | 小程序验收 |

## 快速开始
```powershell
cd backend && . .\.local\local-env.ps1 && mvn spring-boot:run  # 后端
npm run dev                                                       # 前端
```
详见 [本地启动指南](docs/LOCAL_DEV_ONE_CLICK_START.md)

## 安全
不提交 `.env`/`.local`/`local-env.ps1`。密钥用环境变量注入，文档用 `<your-secret>` 占位。
