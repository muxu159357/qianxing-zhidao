const mock = require('../../utils/mock')

Page({
  data: {
    route: null,
    score: 0,
    attractions: [],
    safety: null,
    emptyState: false
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

    this.setData({ route, score, attractions, safety, emptyState: false })
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

  onSaveToMyTrips() {
    const { route, score } = this.data
    if (!route) return

    try {
      let trips = wx.getStorageSync('qianxing_trips') || []
      if (!Array.isArray(trips)) trips = []

      const exists = trips.find(t => t.routeId === route.id || t.id === route.id)
      if (exists) {
        wx.showToast({ title: '该路线已在你的行程中', icon: 'none' })
        return
      }

      const trip = {
        id: `trip_${route.id}_${Date.now()}`,
        routeId: route.id,
        routeName: route.name,
        days: route.days,
        physicalLevel: route.physicalLevel,
        score: score,
        savedAt: new Date().toISOString()
      }

      trips.push(trip)
      wx.setStorageSync('qianxing_trips', trips)

      const app = getApp()
      if (app && app.globalData) {
        app.globalData.myTrips = trips
      }

      wx.showToast({ title: '已保存到我的行程', icon: 'success' })
    } catch (e) {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
    }
  },

  onOpenAiGuide() {
    const { route } = this.data
    if (!route) return

    wx.setStorageSync('qianxing_selected_route', route)
    wx.navigateTo({ url: '/pages/guide/guide' })
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

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})
