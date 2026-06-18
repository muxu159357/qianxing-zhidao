// 黔行智导 · 认证工具
// 统一管理微信登录、JWT token、用户信息、登录检查
var api = require('./api')

var TOKEN_KEY = 'qianxing_auth_token'
var USER_KEY = 'qianxing_auth_user'

// ============ Token 管理 ============

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || ''
}

function setToken(token) {
  wx.setStorageSync(TOKEN_KEY, token)
}

function clearToken() {
  wx.removeStorageSync(TOKEN_KEY)
}

function hasLogin() {
  return !!getToken()
}

// ============ 用户信息管理 ============

function getStoredUser() {
  return wx.getStorageSync(USER_KEY) || null
}

function setStoredUser(user) {
  wx.setStorageSync(USER_KEY, user)
}

function clearStoredUser() {
  wx.removeStorageSync(USER_KEY)
}

// ============ 微信登录 ============

function loginWithWechat() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (loginRes) {
        if (!loginRes.code) {
          reject({ code: -1, message: '获取微信登录凭证失败' })
          return
        }
        api.wechatLogin(loginRes.code)
          .then(function (loginData) {
            setToken(loginData.token)
            setStoredUser({
              id: loginData.userId,
              nickname: loginData.nickname,
              avatarUrl: loginData.avatarUrl,
              isNewUser: loginData.newUser
            })
            resolve(loginData)
          })
          .catch(function (err) {
            reject(err)
          })
      },
      fail: function () {
        reject({ code: -1, message: '微信登录失败，请稍后再试' })
      }
    })
  })
}

function ensureLogin(options) {
  options = options || {}
  var title = options.title || '需要登录'
  var content = options.content || '该功能需要登录后才能使用，是否现在登录？'

  return new Promise(function (resolve) {
    if (hasLogin()) {
      resolve(true)
      return
    }

    wx.showModal({
      title: title,
      content: content,
      confirmText: '去登录',
      cancelText: '稍后再说',
      success: function (modalRes) {
        if (!modalRes.confirm) {
          resolve(false)
          return
        }

        wx.showLoading({ title: '登录中...', mask: true })

        loginWithWechat()
          .then(function () {
            wx.hideLoading()
            wx.showToast({ title: '登录成功', icon: 'success', duration: 1500 })
            resolve(true)
          })
          .catch(function (err) {
            wx.hideLoading()
            handleLoginError(err)
            resolve(false)
          })
      }
    })
  })
}

function handleLoginError(err) {
  var code = err.code || 0

  if (code === 501) {
    wx.showModal({
      title: '功能暂未启用',
      content: '登录功能当前暂未配置，请稍后再试。\n\n你可以继续浏览景点和路线信息。',
      showCancel: false,
      confirmText: '我知道了'
    })
  } else if (code === 401) {
    clearToken()
    clearStoredUser()
    wx.reLaunch({ url: '/pages/login/login' })
  } else {
    wx.showToast({
      title: err.message || '登录暂不可用，请稍后再试',
      icon: 'none',
      duration: 2000
    })
  }
}

function logout() {
  clearToken()
  clearStoredUser()
  wx.showToast({ title: '已退出登录', icon: 'none', duration: 1500 })
}

/**
 * 登录守卫：在页面 onShow 中调用，未登录时跳转登录页。
 * 登录页自身不会触发跳转（避免循环）。
 */
function requireLoginRedirect() {
  var pages = getCurrentPages()
  var current = pages.length > 0 ? pages[pages.length - 1].route : ''
  // 登录页自身不跳转
  if (current === 'pages/login/login') return false
  if (!hasLogin()) {
    wx.reLaunch({ url: '/pages/login/login' })
    return false
  }
  return true
}

module.exports = {
  getToken: getToken,
  setToken: setToken,
  clearToken: clearToken,
  hasLogin: hasLogin,
  getStoredUser: getStoredUser,
  setStoredUser: setStoredUser,
  clearStoredUser: clearStoredUser,
  loginWithWechat: loginWithWechat,
  ensureLogin: ensureLogin,
  handleLoginError: handleLoginError,
  logout: logout,
  requireLoginRedirect: requireLoginRedirect
}
