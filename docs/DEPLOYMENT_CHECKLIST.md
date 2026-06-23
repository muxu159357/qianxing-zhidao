# 黔行智导 · 上线部署检查清单
## 后端
- JWT_SECRET>=32字节 prod下强校验
- Flyway migration成功
- Redis生产必须开启
- ADMIN_BOOTSTRAP_*创建后关闭
- AI/天气Key缺失时降级不影响启动
## 后台Web
- npm run build成功
- /admin/login可访问
- 401自动跳登录
## 小程序
- 根级project.config.json存在
- request合法域名配置HTTPS
- DevTools编译无错误
- 无Mock/Demo/测试/TODO
## 构建
mvn clean compile && mvn test
npm run build
.\scripts\check-backend-health.ps1
