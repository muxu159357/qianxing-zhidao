var auth = require('../../utils/auth')

Page({
  data: {
    loading: false,
    errorMsg: ''
  },

  onLoad() {
    if (auth.hasLogin()) {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  onShow() {
    if (auth.hasLogin()) {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  handleLogin() {
    var self = this
    if (self.data.loading) return

    self.setData({ loading: true, errorMsg: '' })

    auth.loginWithWechat()
      .then(function () {
        self.setData({ loading: false })
        wx.switchTab({ url: '/pages/index/index' })
      })
      .catch(function (err) {
        self.setData({ loading: false })
        var code = err.code || 0
        if (code === 501) {
          self.setData({ errorMsg: '登录功能暂未配置，请联系管理员' })
        } else if (code === 400) {
          self.setData({ errorMsg: err.message || '登录凭证已失效，请重新点击登录' })
        } else if (code === -1) {
          self.setData({ errorMsg: '网络不可用，请检查后端服务' })
        } else {
          self.setData({ errorMsg: '微信登录暂不可用，请稍后重试' })
        }
      })
  }
})
