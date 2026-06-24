// 小程序环境配置
// devLocal:   开发者工具模拟器 (localhost)
// devTunnel: 手机真机预览 (cpolar/ngrok/natapp 穿透)
// prod:      正式上线 (HTTPS域名+微信合法域名)
var ACTIVE = 'devLocal'
module.exports = {
  devLocal:  'http://localhost:8080',
  devTunnel: 'https://<your-tunnel>.example.com',
  prod:      'https://<your-api-domain>.com',
  get BASE_URL() { return this[ACTIVE] }
}

