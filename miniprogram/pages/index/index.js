var mock = require('../../utils/mock')
var assetResolver = require('../../utils/asset-resolver')
var api = require('../../utils/api')
var adapters = require('../../utils/adapters')

Page({
  data: {
    features: [
      { key:'profile', tag:'画像', icon:'/assets/images/icons/icon-profile.png', title:'兴趣画像', desc:'根据你的偏好、体力和出行节奏生成旅行画像。', bg:'rgba(31,143,95,0.1)' },
      { key:'route', tag:'路线', icon:'/assets/images/icons/icon-route.png', title:'专属路线', desc:'结合贵州山地景点、游玩时长和安全因素推荐路线。', bg:'rgba(47,107,255,0.1)' },
      { key:'guide', tag:'伴游', icon:'/assets/images/icons/icon-guide.png', title:'AI 伴游', desc:'提供景点讲解、行程建议和实时出行问答。', bg:'rgba(230,126,34,0.1)' },
      { key:'safety', tag:'安全', icon:'/assets/images/icons/icon-safety.png', title:'安全守护', desc:'结合山地天气、体力消耗和路线风险提供安全提醒。', bg:'rgba(31,143,95,0.08)' }
    ],
    topRoutes: []
  },

  onLoad() {
    var that = this
    api.getRoutes({ page: 1, size: 3 }).then(function (data) {
      var routes = adapters.apiRoutesToRoutes(data.records || [])
      if (routes.length > 0) {
        var top = routes.slice(0, 3).map(function (r) {
          return { route: r, coverImage: assetResolver.resolveRouteCover(r) }
        })
        that.setData({ topRoutes: top })
        return
      }
      throw new Error('empty')
    }).catch(function () {
      mock.getRoutes().then(function (routes) {
        var top = routes.slice(0, 3).map(function (r) {
          return { route: r, coverImage: assetResolver.resolveRouteCover(r) }
        })
        that.setData({ topRoutes: top })
      })
    })
  },

  goPlanner() { wx.navigateTo({ url: '/pages/planner/planner' }) },
  goKnowledge() { wx.navigateTo({ url: '/pages/knowledge/knowledge' }) },

  goRouteDetail(e) {
    const id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({ url: `/pages/route-detail/route-detail?id=${id}` })
    } else {
      wx.showToast({ title: '路线信息加载中，请稍后再试', icon: 'none' })
    }
  },

  onFeatureTap(e) {
    const key = e.currentTarget.dataset.key
    switch (key) {
      case 'profile':
        wx.navigateTo({ url: '/pages/planner/planner' })
        break
      case 'route': {
        const profile = wx.getStorageSync('qianxing_profile')
        if (profile) {
          wx.navigateTo({ url: '/pages/recommend/recommend' })
        } else {
          wx.showToast({ title: '请先选择偏好，为你生成路线', icon: 'none', duration: 1500 })
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/planner/planner' })
          }, 1500)
        }
        break
      }
      case 'guide':
        wx.switchTab({ url: '/pages/guide/guide' })
        break
      case 'safety': {
        const routes = this.data.topRoutes
        if (routes && routes.length > 0) {
          wx.showToast({ title: '正在为你打开路线安全提醒', icon: 'none', duration: 1200 })
          setTimeout(() => {
            wx.navigateTo({ url: `/pages/route-detail/route-detail?id=${routes[0].route.id}&focus=safety` })
          }, 1200)
        } else {
          wx.showToast({ title: '请先查看推荐路线', icon: 'none' })
        }
        break
      }
      default:
        wx.navigateTo({ url: '/pages/planner/planner' })
    }
  }
})
