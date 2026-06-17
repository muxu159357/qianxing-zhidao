var mock = require('../../utils/mock')
var tripStorage = require('../../utils/trip-storage')
var assetResolver = require('../../utils/asset-resolver')

Page({
  data: {
    route: null,
    score: 0,
    attractions: [],
    safety: null,
    emptyState: false,
    hasSavedTrip: false,
    recommendExplanation: null,
    routeCoverImage: ''
  },

  onLoad(options) {
    const id = options.id
    const score = parseInt(options.score) || 0

    if (!id) {
      this.setData({ emptyState: true })
      return
    }

    this.loadRoute(id, score)
  },

  async loadRoute(id, score) {
    const route = await mock.getRouteById(id)

    if (!route) {
      this.setData({ emptyState: true })
      return
    }

    const attractions = await mock.getAttractionsByIds(route.attractionIds || [])

    const safety = this.computeSafety(route)

    var coverImage = assetResolver.resolveRouteCover(route)
    this.setData({ route: route, score: score, attractions: attractions, safety: safety, emptyState: false, routeCoverImage: coverImage })

    // V11: Generate recommendation explanation
    var profile = null
    var sel = null
    try { profile = wx.getStorageSync('qianxing_profile') } catch (e) { /* ignore */ }
    try { sel = wx.getStorageSync('qianxing_selection') } catch (e) { /* ignore */ }
    var recommendExplanation = this._buildRecommendExplanation(profile, sel, route, attractions)
    this.setData({ recommendExplanation: recommendExplanation })

    this.checkIfSaved()
  },

  computeSafety(route) {
    const physicalLevel = route.physicalLevel || '适中'
    const attractionIds = route.attractionIds || []
    const tags = route.tags || []

    const riskLevelMap = { '轻松': 'low', '适中': 'mid', '挑战': 'high' }
    const riskLevel = riskLevelMap[physicalLevel] || 'mid'
    const riskLabelMap = { 'low': '低风险', 'mid': '中风险', 'high': '高风险' }
    const riskLabel = riskLabelMap[riskLevel] || '中风险'

    let physicalReminder = ''
    if (physicalLevel === '挑战') {
      physicalReminder = '本路线体力消耗较大，建议提前进行适度体能准备，游览中注意及时补充水分和能量。'
    } else if (physicalLevel === '适中') {
      physicalReminder = '本路线体力消耗适中，建议合理安排每日行程节奏，避免连续高强度游览。'
    } else {
      physicalReminder = '本路线节奏轻松，适合悠闲游览，可根据个人状态自由调整行程。'
    }

    const weatherReminder = '贵州山区天气多变，早晚温差较大，建议随身携带雨具和薄外套。出行前请关注当地气象信息。'

    const mountainSpots = ['fanjingshan', 'chishui', 'wanfenglin']
    const hasMountain = attractionIds.some(id => mountainSpots.includes(id))
    const mountainReminder = hasMountain
      ? '本路线包含山地徒步路段，建议穿着防滑运动鞋，在上午时段完成主要攀登段。山区部分区域信号较弱，请提前下载离线地图。'
      : null

    const hotSpots = ['huangguoshu', 'xijiang']
    const hasHot = attractionIds.some(id => hotSpots.includes(id))
    const peakReminder = hasHot
      ? '本路线含热门景点，上午9-11点、下午2-4点为客流高峰时段，建议错峰游览以获得更好体验。'
      : null

    const staminaReminder = route.days >= 3
      ? `本路线共${route.days}天行程，建议前段保持体力、中段重点游览、末段适当放松，避免第一天过度消耗。`
      : null

    const servicePoints = ['景区游客中心', '医疗点', '就近补给点', '警务服务站']

    const emergencyContacts = [
      { label: '紧急报警', number: '110' },
      { label: '医疗急救', number: '120' },
      { label: '景区服务热线', note: '以现场公示为准' }
    ]

    let alternativeRoute = null
    if (physicalLevel === '挑战' || physicalLevel === '适中') {
      const allRoutes = mock.routes || []
      const targetLevel = physicalLevel === '挑战' ? '适中' : '轻松'
      alternativeRoute = allRoutes.find(r =>
        r.id !== route.id &&
        (r.physicalLevel === targetLevel || r.physicalLevel === '轻松') &&
        r.tags.some(t => tags.includes(t))
      )
      if (alternativeRoute) {
        alternativeRoute = {
          id: alternativeRoute.id,
          name: alternativeRoute.name,
          physicalLevel: alternativeRoute.physicalLevel
        }
      }
    }

    return {
      riskLevel,
      riskLabel,
      physicalReminder,
      weatherReminder,
      mountainReminder,
      peakReminder,
      staminaReminder,
      servicePoints,
      emergencyContacts,
      alternativeRoute
    }
  },

  /* ========== V11: Recommendation explanation ========== */

  _buildRecommendExplanation(profile, sel, route, attractions) {
    var result = { summary: '', matchItems: [], notices: [] }
    var routeTags = route.tags || []

    // Resolve user interest tag names
    var tags = []
    try { var mock = require('../../utils/mock'); tags = mock.interestTags || [] } catch (e) { /* ignore */ }

    var userTagNames = []
    if (sel && sel.selectedTagIds) {
      sel.selectedTagIds.forEach(function (id) {
        var tag = tags.find(function (t) { return t.id === id })
        if (tag) userTagNames.push(tag.name)
      })
    }

    var matchedInterests = []
    routeTags.forEach(function (rt) {
      if (userTagNames.indexOf(rt) !== -1) matchedInterests.push(rt)
    })

    // Fallback: no profile and no selection
    if (!sel && !profile) {
      result.summary = '该路线覆盖贵州多个代表性目的地，适合作为综合体验路线。你可以先完成兴趣选择，获取更贴近偏好的推荐解释。'
      result.notices = this._buildRouteNoticesForDetail(route)
      return result
    }

    // Summary
    if (matchedInterests.length >= 2) {
      result.summary = '这条路线较好匹配你选择的' + matchedInterests.slice(0, 2).join('、') + '等偏好，适合在有限时间内体验贵州山地景观与民族文化。'
    } else if (matchedInterests.length === 1) {
      result.summary = '这条路线覆盖了你感兴趣的' + matchedInterests[0] + '相关内容，适合作为贵州山地旅游的入门选择。'
    } else {
      result.summary = '这条路线覆盖贵州多个代表性目的地，适合作为综合体验路线。'
    }

    // Match items: interests
    matchedInterests.forEach(function (name) {
      var detail = '路线含' + name + '相关景点'
      var attrs = attractions || []
      var matching = []
      attrs.forEach(function (a) {
        if (a.tags && a.tags.indexOf(name) !== -1) matching.push(a.name)
      })
      if (matching.length > 0) {
        detail = '路线含' + matching.slice(0, 2).join('、')
      }
      result.matchItems.push({ label: name, detail: detail })
    })

    // Match items: days
    if (sel && sel.days && route.days) {
      var daysDiff = Math.abs(sel.days - route.days)
      if (daysDiff === 0) {
        result.matchItems.push({ label: route.days + '天行程', detail: '与你计划的出行天数一致' })
      } else if (daysDiff === 1) {
        result.matchItems.push({ label: route.days + '天行程', detail: '与你计划的' + sel.days + '天接近，可灵活调整' })
      }
    }

    // Match items: physical level
    if (sel && sel.physicalLevel && route.physicalLevel) {
      if (sel.physicalLevel === route.physicalLevel) {
        var levelMap = { '轻松': '轻松节奏', '适中': '体力适中', '挑战': '体力挑战' }
        result.matchItems.push({ label: levelMap[route.physicalLevel] || route.physicalLevel, detail: '与当前路线节奏匹配' })
      }
    }

    // Notices
    result.notices = this._buildRouteNoticesForDetail(route)

    // Cap match items
    if (result.matchItems.length > 6) result.matchItems = result.matchItems.slice(0, 6)

    return result
  },

  _buildRouteNoticesForDetail(route) {
    var notices = []
    var physicalLevel = route.physicalLevel || '适中'
    var days = route.days || 1

    if (physicalLevel === '挑战') {
      notices.push('山地景区步行较多，建议穿舒适防滑鞋')
    } else {
      notices.push('部分景点需要步行，建议穿着舒适鞋子')
    }

    if (days >= 3) {
      notices.push('多日行程建议合理分配每日体力，前段保持体力、中段重点游览')
    } else {
      notices.push('建议提前查看景区开放时间和预约情况')
    }

    notices.push('景点之间路程较长，建议预留充足的交通时间')

    return notices.slice(0, 3)
  },

  onSaveOrViewTrip() {
    if (this.data.hasSavedTrip) {
      wx.switchTab({ url: '/pages/my-trips/my-trips' })
      return
    }
    this.onSaveToMyTrips()
  },

  checkIfSaved() {
    try {
      const trips = wx.getStorageSync('qianxing_trips') || []
      const { route } = this.data
      if (!route) return
      const exists = trips.find(t => t.routeId === route.id || t.id === route.id)
      if (exists) {
        this.setData({ hasSavedTrip: true })
      }
    } catch (e) { /* ignore */ }
  },

  onSaveToMyTrips() {
    const { route, score } = this.data
    if (!route) return

    try {
      let trips = wx.getStorageSync('qianxing_trips') || []
      if (!Array.isArray(trips)) trips = []

      const exists = trips.find(t => t.routeId === route.id || t.id === route.id)
      if (exists) {
        this.setData({ hasSavedTrip: true })
        wx.showToast({ title: '该路线已在你的行程中', icon: 'none' })
        return
      }

      const trip = {
        id: `trip_${route.id}_${Date.now()}`,
        routeId: route.id,
        routeName: route.name,
        days: route.days,
        dayCount: route.days,
        physicalLevel: route.physicalLevel,
        energyLevel: route.physicalLevel,
        spotCount: (route.attractionIds && route.attractionIds.length) || (this.data.attractions && this.data.attractions.length) || 0,
        spotNames: (this.data.attractions || []).map(a => a.name).slice(0, 4),
        spotIds: route.attractionIds || [],
        dayPlans: route.dailyPlan || [],
        score: score,
        savedAt: new Date().toISOString(),
        status: 'upcoming',
        startedAt: null,
        completedAt: null,
        customName: null,
        travelStartDate: null,
        travelEndDate: null
      }

      tripStorage.addTrip(trip)

      const app = getApp()
      if (app && app.globalData) {
        app.globalData.myTrips = tripStorage.getTrips()
      }

      this.setData({ hasSavedTrip: true })
      wx.showToast({ title: '已保存到我的行程', icon: 'success' })
    } catch (e) {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
    }
  },

  onOpenAiGuide() {
    const { route } = this.data
    if (!route) return

    wx.setStorageSync('qianxing_selected_route', route)
    wx.switchTab({ url: '/pages/guide/guide' })
  },

  onViewScenic(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: `/pages/scenic-detail/scenic-detail?id=${id}` })
  },

  onViewAlternative() {
    const { safety } = this.data
    if (!safety || !safety.alternativeRoute) return
    wx.navigateTo({ url: `/pages/route-detail/route-detail?id=${safety.alternativeRoute.id}` })
  },

  onGoRecommend() {
    wx.navigateTo({ url: '/pages/recommend/recommend' })
  },

  onCoverError() {
    this.setData({ routeCoverImage: '/assets/images/routes/route-default.png' })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
