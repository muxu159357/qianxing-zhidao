# Figma 后台管理设计分析
## 技术栈: React 18 + Vite 6 + TailwindCSS 4 + shadcn/ui + radix + lucide-react + recharts + MUI 7
## 设计 Token
- 背景 #f8fafc / 卡片 #fff / 主文字 #0f172a / 次文 #64748b
- 主色 #0d9488 / 主色深 #0f766e / 浅背景 #f0fdf9 / 强调 #ccfbf1
- 边框 #e2e8f0 / 圆角 8-12px / 侧边栏 #fff
## 状态 Badge
| 已上架 | emerald-50 + emerald-700 |
| 已下架 | slate-100 + slate-500 |
| 草稿 | amber-50 + amber-700 |
| 已发布 | teal-50 + teal-700 |
## Vue 后台对应: Layout+8个管理页
## 不复制React代码原因: 技术栈不兼容(Vue vs React),仅提取视觉用Element Plus实现
## 已完成: AdminLayout + AdminDashboardPage
