# 本地开发一键启动指南

## 端口
| 服务 | 端口 |
|------|------|
| 后端 API | 8080 |
| 后台前端 | 5173 |
| MySQL | 3306 |

## 启动
```powershell
# 1. 后端
cd backend && . .\.local\local-env.ps1 && mvn spring-boot:run

# 2. 前端
cd .. && npm run dev

# 3. 小程序 → 微信开发者工具导入 miniprogram/
```

## 验证
- 后端: `curl http://localhost:8080/health`
- 前端: `http://localhost:5173/admin/login`

## 检查
```powershell
.\scripts\check-miniprogram-files.ps1
```

## 构建
```powershell
npm run build
cd backend && mvn clean compile && mvn test
```

## 停止
```powershell
# 前端/后端: Ctrl+C
```

## 常见问题
| 问题 | 解决 |
|------|------|
| npm报错 | `npm install` |
| 8080占用 | `netstat -ano \| findstr 8080` |
| WXSS编译错误 | 无`*`/`var()`/`:root` |

## 手机真机预览
### 方案 A: 同 WiFi (电脑连 WiFi)
1. 手机电脑同 WiFi, `ipconfig` 查 IPv4
2. 修改 `config/env.js` 的地址为 `http://IP:8080`
3. 防火墙放行 8080

### 方案 B: 专线网络 (内网穿透, 推荐)
1. 启动后端 `localhost:8080`
2. 穿透: `cpolar http 8080` → 获得 `https://xxx.cpolar.cn`
3. 修改 `config/env.js`: `ACTIVE='devTunnel'`, 填入穿透地址
4. 微信勾选「不校验合法域名」→ 编译 → 手机扫码

注意: 穿透地址不提交 Git。正式上线用固定 HTTPS 域名。
