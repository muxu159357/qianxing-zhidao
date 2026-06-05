const mock = require('../../utils/mock')

Page({
  data: { routes: [], loading: true, expandedId: null },

  onLoad() {
    const sel = wx.getStorageSync('qianxing_selection')
    if (!sel || sel.selectedTagIds.length < 2) {
      wx.showToast({ title: '请先设置偏好', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    this.loadRoutes(sel)
  },

  async loadRoutes(sel) {
    const tags = mock.interestTags
    const ranked = await Promise.all(mock.routes.map(async (route) => {
      let score = 0
      const reasons = []
      for (const tag of route.tags) {
        if (sel.selectedTagIds.includes(tag) || tags.find(t => t.name === tag && sel.selectedTagIds.includes(t.id))) {
          score += 25
          reasons.push(tag + '偏好匹配')
        }
      }
      if (route.physicalLevel === sel.physicalLevel) { score += 15; reasons.push('体力等级一致') }
      if (route.suitableFor.includes(sel.companion)) { score += 15; reasons.push('适合' + sel.companion) }
      if (Math.abs(route.days - sel.days) <= 1) score += 10
      return { route, score: Math.min(score, 85) + Math.floor(Math.random() * 15), reasons }
    }))
    ranked.sort((a, b) => b.score - a.score)
    this.setData({ routes: ranked, loading: false })
  },

  toggleExpand(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ expandedId: this.data.expandedId === id ? null : id })
  },

  selectRoute(e) {
    const id = e.currentTarget.dataset.id
    const route = this.data.routes.find(r => r.route.id === id)
    if (route) {
      wx.setStorageSync('qianxing_selected_route', route.route)
      const app = getApp()
      if (app.globalData) {
        app.globalData.myTrips = [...(app.globalData.myTrips || []), { route: route.route, selectedAt: new Date().toISOString() }]
        wx.setStorageSync('qianxing_trips', app.globalData.myTrips)
      }
      wx.navigateTo({ url: '/pages/guide/guide' })
    }
  }
})
