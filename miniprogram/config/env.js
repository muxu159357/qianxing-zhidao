// 小程序环境配置
// USE_LAN=false → 开发者工具( localhost )
// USE_LAN=true  → 手机预览( 192.168.197.1 )
var USE_LAN = false
module.exports = {
  localhost: 'http://localhost:8080',
  lan: 'http://192.168.197.1:8080',
  get BASE_URL() { return USE_LAN ? this.lan : this.localhost }
}
