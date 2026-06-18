var mock = require('../../utils/mock')
var auth = require('../../utils/auth')
var assetResolver = require('../../utils/asset-resolver')
var api = require('../../utils/api')
var adapters = require('../../utils/adapters')

Page({
  data: { routes: [], loading: true, expandedId: null },

  onShow() { if (!auth.requireLoginRedirect()) return },

  onLoad() {
    var self = this
    api.getRoutes({ page: 1, size: 20 }).then(function (data) {
      var routes = adapters.apiRoutesToRoutes(data.records || [])
      if (routes.length > 0) {
        self.loadRoutes(routes)
        return
      }
      throw new Error('empty')
    }).catch(function () {
      self._loadMockRoutes()
    })
  },

  _loadMockRoutes: function () {
    var self = this
    mock.getRoutes().then(function (routes) { self.loadRoutes(routes) })
  },

  /* ========== V11: Recommendation explanation helpers ========== */

  _buildRecommendSummary(sel, route) {
    if (!sel || !sel.selectedTagIds || sel.selectedTagIds.length === 0) {
      return '这条路线覆盖贵州多个代表性目的地，适合作为综合体验路线。'
    }

    const tags = mock.interestTags
    const userTagNames = []
    sel.selectedTagIds.forEach(id => {
      const tag = tags.find(t => t.id === id)
      if (tag) userTagNames.push(tag.name)
    })

    const routeTags = route.tags || []
    const matched = routeTags.filter(rt => userTagNames.includes(rt))

    if (matched.length >= 2) {
      return '这条路线较好匹配你选择的' + matched.slice(0, 2).join('、') + '等偏好。'
    } else if (matched.length === 1) {
      return '这条路线覆盖了你感兴趣的' + matched[0] + '相关内容。'
    }
    return '这条路线覆盖贵州代表性目的地，适合作为综合体验路线。'
  },

  _buildMatchTags(sel, route) {
    const items = []
    if (!sel) return items

    const tags = mock.interestTags
    const userTagNames = []
    if (sel.selectedTagIds) {
      sel.selectedTagIds.forEach(id => {
        const tag = tags.find(t => t.id === id)
        if (tag) userTagNames.push(tag.name)
      })
    }

    const routeTags = route.tags || []
    routeTags.forEach(rt => {
      if (userTagNames.includes(rt) && items.length < 3) {
        items.push(rt)
      }
    })

    if (sel.days && route.days && Math.abs(sel.days - route.days) <= 1) {
      items.push(route.days + '天行程')
    }

    if (sel.physicalLevel && route.physicalLevel && sel.physicalLevel === route.physicalLevel) {
      const levelMap = { '轻松': '轻松节奏', '适中': '体力适中', '挑战': '体力挑战' }
      items.push(levelMap[route.physicalLevel] || '体力' + route.physicalLevel)
    }

    return items.slice(0, 4)
  },

  _buildRouteNotice(route) {
    const notices = []
    const physicalLevel = route.physicalLevel || '适中'
    const days = route.days || 1

    if (physicalLevel === '挑战') {
      notices.push('山地景区步行较多，建议穿防滑鞋')
    } else if (physicalLevel === '适中') {
      notices.push('部分景点需要步行，建议穿舒适鞋子')
    }

    if (days >= 3) {
      notices.push('多日行程建议合理分配每日体力')
    }

    if (notices.length === 0) {
      notices.push('建议提前查看景区开放时间')
    }

    return notices.slice(0, 2).join('；')
  },

  async loadRoutes(routes) {
    var sel = wx.getStorageSync('qianxing_selection')
    if (!sel || !sel.selectedTagIds || sel.selectedTagIds.length < 2) {
      wx.showToast({ title: '请先设置偏好', icon: 'none' })
      setTimeout(function () { wx.navigateBack() }, 1500)
      return
    }
    var tags = mock.interestTags
    var self = this
    var routeList = (routes && routes.length > 0) ? routes : (mock.routes || [])
    const ranked = await Promise.all(routeList.map(async (route) => {
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

      var recommendSummary = self._buildRecommendSummary(sel, route)
      var matchTags = self._buildMatchTags(sel, route)
      var routeNotice = self._buildRouteNotice(route)
      var coverImage = assetResolver.resolveRouteCover(route)

      return { route: route, score: Math.min(score, 85) + Math.floor(Math.random() * 15), reasons: reasons, recommendSummary: recommendSummary, matchTags: matchTags, routeNotice: routeNotice, coverImage: coverImage }
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
    const score = e.currentTarget.dataset.score || 0
    const route = this.data.routes.find(r => r.route.id === id)
    if (route) {
      wx.navigateTo({ url: `/pages/route-detail/route-detail?id=${id}&score=${score}` })
    }
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
