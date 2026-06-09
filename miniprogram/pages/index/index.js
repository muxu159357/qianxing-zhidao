const mock = require('../../utils/mock')

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
    mock.getRoutes().then(routes => {
      this.setData({ topRoutes: routes.slice(0, 3) })
    })
  },

  goPlanner() { wx.navigateTo({ url: '/pages/planner/planner' }) },
  goKnowledge() { wx.navigateTo({ url: '/pages/knowledge/knowledge' }) },
  goRouteDetail() {
    wx.navigateTo({ url: '/pages/planner/planner' })
  },

  onFeatureTap(e) {
    const key = e.currentTarget.dataset.key
    switch (key) {
      case 'profile':
        wx.navigateTo({ url: '/pages/planner/planner' })
        break
      case 'route':
        wx.navigateTo({ url: '/pages/planner/planner' })
        break
      case 'guide':
        wx.switchTab({ url: '/pages/guide/guide' })
        break
      case 'safety':
        wx.navigateTo({ url: '/pages/planner/planner' })
        break
      default:
        wx.navigateTo({ url: '/pages/planner/planner' })
    }
  }
})
