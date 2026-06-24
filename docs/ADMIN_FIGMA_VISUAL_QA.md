# 后台 Figma 视觉验收清单

## 当前后台视觉相关 Commit
- `0823091`: Layout + Dashboard Figma 视觉
- `ae13743`: 列表页 Figma 样式补丁(admin-table.css)
- `9f7a2fd`: 管理页逐页补齐模板结构

## 已完成页面清单（9页）
| # | 页面 | 路由 | 状态 |
|---|------|------|------|
| 1 | 登录 | /admin/login | 原有 |
| 2 | 工作台 | /admin/dashboard | Figma重做 |
| 3 | 景点管理 | /admin/scenic | Figma统一 |
| 4 | 路线管理 | /admin/routes | Figma统一 |
| 5 | 路线日程 | /admin/routes/:id/schedule | Figma统一 |
| 6 | 知识库 | /admin/knowledge | Figma统一 |
| 7 | 媒体管理 | /admin/media | Figma统一 |
| 8 | 天气管理 | /admin/weather | Figma统一 |
| 9 | 行程管理 | /admin/trips | Figma统一(只读) |

## 路由检查
- [x] AdminLayout菜单路径与router完全一致
- [x] AI记录/系统设置标记为"建设"禁用态
- [x] /admin 自动跳转 /admin/dashboard

## 菜单检查
- [x] 选中项 teal(#0d9488) 高亮
- [x] Dashboard快捷入口跳转路径正确

## 接口功能检查(静态)
- [x] 景点CRUD/admin-scenic.ts
- [x] 路线CRUD/admin-route.ts
- [x] 路线日程/admin-route-day.ts + admin-route-spot.ts
- [x] 知识库CRUD/admin-knowledge.ts
- [x] 媒体/admin-media.ts
- [x] 天气/admin-weather.ts
- [x] 行程/admin-trip.ts(只读)

## 权限和登录检查(静态)
- [x] Token: localStorage('qianxing_admin_token')
- [x] 401: 拦截→清除token→跳转/admin/login
- [x] Auth Guard: requiresAdmin meta

## 依赖检查
- [x] 零 react/tailwind/shadcn/radix/lucide/@mui
- [x] 纯 Vue 3 + Element Plus

## 构建检查
- [x] npm run build: PASS (10.87s)

## 用户浏览器人工验收步骤
1. 启动后端 → 启动前端(npm run dev)
2. 打开 /admin/login → 登录
3. Dashboard: 统计卡片/图表区/系统状态/快捷入口
4. 景点管理: 搜索/列表/新增/编辑/上下架/分页
5. 路线管理: 搜索/列表/新增/编辑/日程入口
6. 路线日程: 路线选择/天数展开/关联景点
7. 知识库: 搜索/列表/新增/编辑/启停
8. 媒体管理: 列表/类型筛选/启停
9. 天气管理: 列表/新增/编辑/启停
10. 行程管理: 列表/筛选(确认无编辑删除按钮)
11. 刷新页面: token保持不跳登录
12. 清除localStorage qianxing_admin_token: 确认回登录
13. 浏览器控制台(F12): 无报错

## 已知风险
- 图表区为CSS占位,无真实数据
- AI记录/系统设置页面不存在(建设)
- 媒体上传需OSS/S3配置
- Dashboard统计数据为静态展示

## 后续可优化项
- Dashboard接入真实统计接口
- 媒体管理接入OSS/S3上传
- AI记录/系统设置页面开发
- 抽取公共状态Badge组件
