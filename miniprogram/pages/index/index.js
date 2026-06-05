const mock = require('../../utils/mock')

Page({
  data: {
    features: [
      { icon:'🎯', title:'兴趣画像', desc:'多维采集偏好，精准游客画像', bg:'rgba(31,143,95,0.1)' },
      { icon:'🗺️', title:'路线推荐', desc:'AI智能匹配，千人千面定制', bg:'rgba(47,107,255,0.1)' },
      { icon:'💬', title:'AI导游', desc:'实时问答，专业景点讲解', bg:'rgba(230,126,34,0.1)' },
      { icon:'📚', title:'知识库', desc:'覆盖贵州全域景点信息', bg:'rgba(31,143,95,0.08)' }
    ],
    topRoutes: []
  },

  onLoad() {
    mock.getRoutes().then(routes => {
      this.setData({ topRoutes: routes.slice(0, 3) })
    })
  },

  goPlanner() { wx.navigateTo({ url: '/pages/planner/planner' }) },
  goKnowledge() { wx.switchTab({ url: '/pages/knowledge/knowledge' }) },
  goRouteDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.setStorageSync('qianxing_selected_route', mock.routes.find(r => r.id === id))
    wx.navigateTo({ url: '/pages/recommend/recommend' })
  }
})
