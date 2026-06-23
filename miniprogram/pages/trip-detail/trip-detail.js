// pages/trip-detail/trip-detail.js
var tripStorage = require('../../utils/trip-storage')
var auth = require('../../utils/auth')
var api = require('../../utils/api')
var adapters = require('../../utils/adapters')

Page({
  data: {
    trip: null,
    dayPlans: [],
    safetyAlerts: [],
    spotNames: [],
    savedAtText: '',
    statusText: '',
    statusClass: '',
    displayName: '',
    travelDateText: '',
    isEditingName: false,
    editNameValue: '',
    editingDayIndex: -1,
    editForm: {
      title: '',
      description: '',
      meals: '',
      accommodation: ''
    },
    safetyChecklist: [],
    checklistProgress: { checkedCount: 0, totalCount: 0 },
    statusSafetyTitle: '',
    isEditingReview: false,
    reviewForm: {
      rating: 0,
      highlights: '',
      regrets: '',
      nextAdvice: ''
    },
    reviewDateText: '',
    scenicWeather: null
  },

  onShow() { if (!auth.requireLoginRedirect()) return },

  onLoad(options) {
    var id = options.id
    var source = options.source
    if (!id) {
      this.setData({ trip: null })
      return
    }

    var trip = null

    // Remote trip from backend API
    if (source === 'remote' || id.indexOf('remote_') === 0) {
      var numericId = parseInt(id.replace('remote_', ''), 10)
      if (numericId) {
        var self = this
        api.getTrip(numericId).then(function (remoteTrip) {
          var unified = adapters.backendTripToUnified(remoteTrip)
          if (unified) self._initTripData(unified)
          else self.setData({ trip: null })
        }).catch(function () {
          self.setData({ trip: null })
        })
        return
      }
    }

    // Local trip from storage
    try {
      var trips = wx.getStorageSync('qianxing_trips') || []
      trip = trips.find(function (t) { return t.id === id })
    } catch (e) {
      trip = null
    }

    if (!trip) {
      this.setData({ trip: null })
      return
    }
    this._initTripData(trip)
  },

  _initTripData: function (trip) {

    // Compatibility
    trip.status = trip.status || 'upcoming'
    trip.startedAt = trip.startedAt || null
    trip.completedAt = trip.completedAt || null
    trip.customName = trip.customName || null
    trip.travelStartDate = trip.travelStartDate || null
    trip.travelEndDate = trip.travelEndDate || null

    var defaultReview = { rating: 0, highlights: '', regrets: '', nextAdvice: '', updatedAt: null }
    trip.review = trip.review || defaultReview
    var reviewDateText = this.formatReviewDate(trip.review)

    var dayPlans = this.resolveDayPlans(trip)
    var safetyAlerts = this.computeSafety(trip)
    var safetyChecklist = this.resolveSafetyChecklist(trip)
    var checklistProgress = this.getChecklistProgress(safetyChecklist)
    var statusSafetyTitle = this.getStatusSafetyTitle(trip.status)
    var spotNames = (trip.spotNames && trip.spotNames.length > 0) ? trip.spotNames : []
    var savedAtText = this.formatSavedAt(trip.savedAt)
    var statusInfo = this.getStatusInfo(trip.status)
    var displayName = trip.customName || trip.routeName || '未命名行程'
    var travelDateText = this.formatTravelDate(trip.travelStartDate, trip.travelEndDate)

    this.setData({
      trip: trip,
      dayPlans: dayPlans,
      safetyAlerts: safetyAlerts,
      safetyChecklist: safetyChecklist,
      checklistProgress: checklistProgress,
      statusSafetyTitle: statusSafetyTitle,
      spotNames: spotNames,
      savedAtText: savedAtText,
      statusText: statusInfo.text,
      statusClass: statusInfo.className,
      displayName: displayName,
      travelDateText: travelDateText,
      editNameValue: displayName,
      reviewDateText: reviewDateText
    })
  },

  formatSavedAt(isoString) {
    if (!isoString) return '最近保存'
    try {
      var d = new Date(isoString)
      if (isNaN(d.getTime())) return '最近保存'
      return (d.getMonth() + 1) + '月' + d.getDate() + '日保存'
    } catch (e) { return '最近保存' }
  },

  formatTravelDate(startStr, endStr) {
    if (!startStr) return ''
    try {
      var startDate = new Date(startStr)
      if (isNaN(startDate.getTime())) return ''
      var sm = startDate.getMonth() + 1
      var sd = startDate.getDate()
      if (endStr) {
        var endDate = new Date(endStr)
        if (!isNaN(endDate.getTime())) {
          var em = endDate.getMonth() + 1
          var ed = endDate.getDate()
          if (sm === em && sd === ed) return sm + '月' + sd + '日'
          return sm + '月' + sd + '日 — ' + em + '月' + ed + '日'
        }
      }
      return sm + '月' + sd + '日'
    } catch (e) { return '' }
  },

  getStatusInfo(status) {
    if (status === 'active') return { text: '进行中', className: 'trip-status-active' }
    if (status === 'completed') return { text: '已完成', className: 'trip-status-completed' }
    return { text: '未开始', className: 'trip-status-upcoming' }
  },

  /* ========== Generic storage patch ========== */

  updateCurrentTrip(patch) {
    var trip = this.data.trip
    if (!trip) return

    try {
      tripStorage.updateTrip(trip.id, patch)

      var app = getApp()
      if (app && app.globalData) {
        app.globalData.myTrips = tripStorage.getTrips()
      }
    } catch (e) {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      throw e
    }
  },

  /* ========== Name Editing ========== */

  onStartEditName() {
    this.setData({ isEditingName: true, editNameValue: this.data.displayName })
  },

  onCancelEditName() {
    this.setData({ isEditingName: false, editNameValue: this.data.displayName })
  },

  onNameInput(e) {
    this.setData({ editNameValue: e.detail.value })
  },

  onSaveName() {
    var value = (this.data.editNameValue || '').trim()
    var trip = this.data.trip

    if (!value) {
      // Empty → restore routeName
      try { this.updateCurrentTrip({ customName: null }) } catch (e) { return }
      trip.customName = null
      var dn = trip.routeName || '未命名行程'
      this.setData({ isEditingName: false, displayName: dn, editNameValue: dn, trip: trip })
      wx.showToast({ title: '已恢复默认名称', icon: 'success', duration: 1500 })
      return
    }

    if (value.length > 30) {
      value = value.substring(0, 30)
      wx.showToast({ title: '名称不能超过30字，已自动截断', icon: 'none', duration: 2000 })
    }

    try { this.updateCurrentTrip({ customName: value }) } catch (e) { return }
    trip.customName = value
    this.setData({ isEditingName: false, displayName: value, editNameValue: value, trip: trip })
    wx.showToast({ title: '名称已更新', icon: 'success', duration: 1500 })
  },

  /* ========== Date Setting ========== */

  onSetDate(e) {
    var value = e.detail.value  // yyyy-MM-dd
    if (!value) return

    var trip = this.data.trip
    var days = trip.dayCount || trip.days || 1
    var startDate = new Date(value)
    var endDate = new Date(startDate.getTime() + (days - 1) * 86400000)
    var endStr = endDate.getFullYear() + '-' +
      ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' +
      ('0' + endDate.getDate()).slice(-2)

    try { this.updateCurrentTrip({ travelStartDate: value, travelEndDate: endStr }) } catch (e) { return }

    trip.travelStartDate = value
    trip.travelEndDate = endStr
    var tdt = this.formatTravelDate(value, endStr)
    this.setData({ trip: trip, travelDateText: tdt })
    wx.showToast({ title: '出行日期已更新', icon: 'success', duration: 1500 })
  },

  /* ========== Daily Plans ========== */

  resolveDayPlans(trip) {
    if (trip.dayPlans && trip.dayPlans.length > 0) return trip.dayPlans

    try {
      var mock = require('../../utils/mock')
      var routes = mock.routes || []
      var route = routes.find(function (r) { return r.id === trip.routeId })
      if (route && route.dailyPlan && route.dailyPlan.length > 0) return route.dailyPlan
    } catch (e) { /* ignore */ }

    var spots = trip.spotNames || []
    var days = trip.dayCount || trip.days || 1
    var perDay = Math.ceil(spots.length / days)
    var plans = []
    for (var d = 0; d < days; d++) {
      var daySpots = spots.slice(d * perDay, (d + 1) * perDay)
      plans.push({
        day: d + 1,
        title: daySpots.length > 0 ? daySpots.join('、') : '第' + (d + 1) + '天',
        description: daySpots.length > 0 ? '游览 ' + daySpots.join('、') : '自由安排行程，享受贵州山水之美',
        meals: '餐饮信息待补充',
        accommodation: '住宿信息待补充'
      })
    }
    return plans
  },

  /* ========== Day Plan Editing ========== */

  onEditDayPlan(e) {
    var index = e.currentTarget.dataset.index
    if (index === undefined || index === null) return
    var dayPlan = this.data.dayPlans[index]
    if (!dayPlan) return
    this.setData({
      editingDayIndex: index,
      editForm: {
        title: dayPlan.title || '',
        description: dayPlan.description || '',
        meals: dayPlan.meals || '',
        accommodation: dayPlan.accommodation || ''
      }
    })
  },

  onDayPlanInput(e) {
    var field = e.currentTarget.dataset.field
    if (!field) return
    var value = e.detail.value || ''
    var max = field === 'title' ? 30 : 200
    if (value.length > max) value = value.substring(0, max)
    var editForm = this.data.editForm
    editForm[field] = value
    this.setData({ editForm: editForm })
  },

  onCancelEditDay() {
    this.setData({
      editingDayIndex: -1,
      editForm: { title: '', description: '', meals: '', accommodation: '' }
    })
  },

  onSaveDayPlan() {
    var index = this.data.editingDayIndex
    if (index < 0) return
    var trip = this.data.trip
    if (!trip) return
    var dayPlans = this.data.dayPlans.slice()
    var current = dayPlans[index]
    if (!current) return
    var form = this.data.editForm
    var title = (form.title || '').trim()
    var updated = {
      day: current.day,
      attractionIds: current.attractionIds || [],
      title: title || current.title,
      description: (form.description || '').trim(),
      meals: (form.meals || '').trim(),
      accommodation: (form.accommodation || '').trim(),
      isEdited: true,
      updatedAt: new Date().toISOString()
    }
    dayPlans[index] = updated
    try { this.updateCurrentTrip({ dayPlans: dayPlans }) } catch (e) { return }
    trip.dayPlans = dayPlans
    this.setData({
      trip: trip,
      dayPlans: dayPlans,
      editingDayIndex: -1,
      editForm: { title: '', description: '', meals: '', accommodation: '' }
    })
    wx.showToast({ title: '安排已更新', icon: 'success', duration: 1500 })
  },

  onRestoreDayPlan() {
    var index = this.data.editingDayIndex
    if (index < 0) return
    var trip = this.data.trip
    if (!trip || !trip.routeId) {
      wx.showToast({ title: '无法恢复默认安排', icon: 'none' })
      return
    }
    var original = null
    try {
      var mock = require('../../utils/mock')
      var routes = mock.routes || []
      var route = routes.find(function (r) { return r.id === trip.routeId })
      if (route && route.dailyPlan && route.dailyPlan[index]) {
        original = route.dailyPlan[index]
      }
    } catch (e) { /* ignore */ }

    if (!original) {
      wx.showToast({ title: '无法恢复默认安排', icon: 'none' })
      return
    }

    var dayPlans = this.data.dayPlans.slice()
    dayPlans[index] = {
      day: original.day,
      title: original.title,
      attractionIds: original.attractionIds || [],
      description: original.description || '',
      meals: original.meals || '',
      accommodation: original.accommodation || '',
      isEdited: false,
      updatedAt: null
    }
    try { this.updateCurrentTrip({ dayPlans: dayPlans }) } catch (e) { return }
    trip.dayPlans = dayPlans
    this.setData({
      trip: trip,
      dayPlans: dayPlans,
      editingDayIndex: -1,
      editForm: { title: '', description: '', meals: '', accommodation: '' }
    })
    wx.showToast({ title: '已恢复默认安排', icon: 'success', duration: 1500 })
  },

  /* ========== Safety Checklist & Alerts (V5) ========== */

  getStatusSafetyTitle(status) {
    if (status === 'active') return '途中安全提醒'
    if (status === 'completed') return '行程安全回顾'
    return '出发前安全准备'
  },

  generateDefaultChecklist(trip) {
    var energyLevel = trip.energyLevel || trip.physicalLevel || '适中'
    var dayCount = trip.dayCount || trip.days || 1
    var items = [
      { id: 'id-card', text: '携带身份证件', checked: false, category: 'basic' },
      { id: 'phone-battery', text: '检查手机电量和存储空间', checked: false, category: 'basic' },
      { id: 'power-bank', text: '准备充电宝和数据线', checked: false, category: 'basic' },
      { id: 'hours-check', text: '提前查看景区开放时间', checked: false, category: 'basic' },
      { id: 'rain-gear', text: '准备雨具和薄外套', checked: false, category: 'weather' },
      { id: 'weather-check', text: '关注贵州山区天气变化', checked: false, category: 'weather' }
    ]
    if (energyLevel !== '轻松') {
      items.push({ id: 'shoes', text: '准备舒适防滑鞋', checked: false, category: 'mountain' })
    }
    if (energyLevel === '挑战') {
      items.push({ id: 'water', text: '携带充足饮用水', checked: false, category: 'mountain' })
      items.push({ id: 'clinic-locate', text: '了解附近医疗点位置', checked: false, category: 'health' })
    }
    if (dayCount >= 3 || energyLevel === '挑战') {
      items.push({ id: 'medicine', text: '携带常用药品和创可贴', checked: false, category: 'health' })
    }
    if (dayCount >= 2) {
      items.push({ id: 'transport', text: '确认每日交通衔接方式', checked: false, category: 'traffic' })
    }
    return items
  },

  resolveSafetyChecklist(trip) {
    var existing = trip.safetyChecklist
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      var defaults = this.generateDefaultChecklist(trip)
      try { this.updateCurrentTrip({ safetyChecklist: defaults }) } catch (e) { return defaults }
      trip.safetyChecklist = defaults
      return defaults
    }
    var defaults = this.generateDefaultChecklist(trip)
    var existingIds = {}
    existing.forEach(function (item) { existingIds[item.id] = true })
    var missing = []
    defaults.forEach(function (item) {
      if (!existingIds[item.id]) missing.push(item)
    })
    if (missing.length > 0) {
      var merged = existing.concat(missing)
      try { this.updateCurrentTrip({ safetyChecklist: merged }) } catch (e) { return existing }
      trip.safetyChecklist = merged
      return merged
    }
    return existing
  },

  getChecklistProgress(checklist) {
    if (!checklist || checklist.length === 0) return { checkedCount: 0, totalCount: 0 }
    var checked = 0
    checklist.forEach(function (item) { if (item.checked) checked++ })
    return { checkedCount: checked, totalCount: checklist.length }
  },

  onToggleCheckItem(e) {
    if (this.data.editingDayIndex >= 0) return
    var id = e.currentTarget.dataset.id
    if (!id) return
    var checklist = this.data.safetyChecklist.slice()
    var found = false
    for (var i = 0; i < checklist.length; i++) {
      if (checklist[i].id === id) {
        checklist[i] = { id: checklist[i].id, text: checklist[i].text, checked: !checklist[i].checked, category: checklist[i].category }
        found = true
        break
      }
    }
    if (!found) return
    try { this.updateCurrentTrip({ safetyChecklist: checklist }) } catch (e) { return }
    var trip = this.data.trip
    if ((trip.source === 'remote' || (trip.id + '').indexOf('remote_') === 0) && (trip.remoteId || parseInt((trip.id + '').replace('remote_', ''), 10))) { api.updateTripSafetyItem(trip.remoteId, id, { isChecked: checklist.find(function(c){return c.id===id}).checked ? 1 : 0 }).catch(function(){}) }
    trip.safetyChecklist = checklist
    var progress = this.getChecklistProgress(checklist)
    this.setData({ trip: trip, safetyChecklist: checklist, checklistProgress: progress })
  },

  computeSafety(trip) {
    var status = trip.status || 'upcoming'
    var energyLevel = trip.energyLevel || trip.physicalLevel || '适中'
    var dayCount = trip.dayCount || trip.days || 1
    var spotCount = trip.spotCount || (trip.spotNames ? trip.spotNames.length : 0)
    var spotNames = trip.spotNames || []
    var travelStartDate = trip.travelStartDate
    var alerts = []

    // Layer 1: status
    if (status === 'active') {
      alerts.push({ type: 'status', text: '你正在旅行中，请注意途中安全，合理分配体力，避免夜间走山路。遇到突发情况请及时求助。' })
    } else if (status === 'completed') {
      alerts.push({ type: 'status', text: '你已完成这段行程，可以回顾准备清单和安全提醒，为下次出行积累经验。' })
    } else {
      alerts.push({ type: 'status', text: '出发前请确认证件、交通和景区开放信息，建议提前完成出行准备清单。' })
    }

    // Layer 2: energyLevel
    if (energyLevel === '挑战') {
      alerts.push({ type: 'energy', text: '本行程体力消耗较大，务必准备防滑鞋、充足饮水，避免单独前往偏远路段。注意补充水分和能量。' })
    } else if (energyLevel === '适中') {
      alerts.push({ type: 'energy', text: '本行程体力消耗适中，建议合理安排每日游览节奏，避免连续高强度游览。' })
    } else {
      alerts.push({ type: 'energy', text: '本行程节奏轻松，适合悠闲游览，可根据个人状态自由调整行程。' })
    }

    // Layer 3: dayCount
    if (dayCount === 1) {
      alerts.push({ type: 'pace', text: '一日游行程，建议轻装出行，携带必要物品即可。' })
    } else if (dayCount <= 3) {
      alerts.push({ type: 'pace', text: dayCount + '天行程，请备好换洗衣物和日常用品，注意住宿衔接。' })
    } else {
      alerts.push({ type: 'pace', text: dayCount + '天长途行程，建议携带常用药品、充足衣物，提前确认每日交通和住宿安排。' })
    }

    // Layer 4: spotCount density
    var density = dayCount > 0 ? Math.round(spotCount / dayCount) : 0
    if (density >= 3) {
      alerts.push({ type: 'density', text: '每天平均' + density + '个景点，建议合理安排游览顺序，预留充足的交通和休息时间。' })
    }

    // Layer 5: spotNames keyword matching
    var hasWaterfall = false, hasMountain = false, hasGorge = false, hasCave = false
    spotNames.forEach(function (name) {
      if (!name) return
      if (name.indexOf('瀑布') !== -1) hasWaterfall = true
      if (name.indexOf('山') !== -1 || name.indexOf('峰') !== -1 || name.indexOf('岭') !== -1) hasMountain = true
      if (name.indexOf('峡谷') !== -1) hasGorge = true
      if (name.indexOf('洞') !== -1) hasCave = true
    })
    if (hasWaterfall) {
      alerts.push({ type: 'spot', text: '行程含瀑布景点，栈道可能湿滑，请注意脚下安全，远离未设护栏区域。' })
    }
    if (hasMountain) {
      alerts.push({ type: 'spot', text: '行程含山地景点，海拔变化较大，注意体力分配和高海拔不适反应。' })
    }
    if (hasGorge) {
      alerts.push({ type: 'spot', text: '行程含峡谷景点，注意落石警示标志，雨天建议调整行程。' })
    }
    if (hasCave) {
      alerts.push({ type: 'spot', text: '行程含溶洞景点，洞内湿滑昏暗，注意脚下安全和头部保护。' })
    }

    // Layer 6: travelStartDate
    if (travelStartDate) {
      try {
        var d = new Date(travelStartDate)
        if (!isNaN(d.getTime())) {
          var dateStr = (d.getMonth() + 1) + '月' + d.getDate() + '日'
          alerts.push({ type: 'service', text: '出行日期为' + dateStr + '，建议提前查看景区开放时间和预约情况。' })
        }
      } catch (e) { /* ignore */ }
    }

    // Fallback: always add weather + service base reminders
    alerts.push({ type: 'weather', text: '贵州山区天气多变，早晚温差较大，建议随身携带雨具和薄外套。出行前请关注当地气象信息。' })
    alerts.push({ type: 'service', text: '沿途设有游客中心、医疗点和补给点。紧急情况请拨打 110（报警）或 120（急救）。' })

    // Cap at 8 alerts max
    if (alerts.length > 8) alerts = alerts.slice(0, 8)
    return alerts
  },

  /* ========== Review (V7) ========== */

  formatReviewDate(review) {
    if (!review || !review.updatedAt) return ''
    try {
      var d = new Date(review.updatedAt)
      if (isNaN(d.getTime())) return ''
      return (d.getMonth() + 1) + '月' + d.getDate() + '日'
    } catch (e) { return '' }
  },

  onStartEditReview() {
    var trip = this.data.trip
    var review = (trip && trip.review) ? trip.review : { rating: 0, highlights: '', regrets: '', nextAdvice: '', updatedAt: null }
    this.setData({
      isEditingReview: true,
      reviewForm: {
        rating: review.rating || 0,
        highlights: review.highlights || '',
        regrets: review.regrets || '',
        nextAdvice: review.nextAdvice || ''
      }
    })
  },

  onCancelEditReview() {
    this.setData({
      isEditingReview: false,
      reviewForm: { rating: 0, highlights: '', regrets: '', nextAdvice: '' }
    })
  },

  onReviewInput(e) {
    var field = e.currentTarget.dataset.field
    if (!field) return
    var value = e.detail.value || ''
    if (value.length > 200) value = value.substring(0, 200)
    var reviewForm = this.data.reviewForm
    reviewForm[field] = value
    this.setData({ reviewForm: reviewForm })
  },

  onReviewStarTap(e) {
    var rating = Number(e.currentTarget.dataset.rating) || 0
    if (rating < 0) rating = 0
    if (rating > 5) rating = 5
    this.setData({ 'reviewForm.rating': rating })
  },

  onSaveReview() {
    var form = this.data.reviewForm
    var rating = Number(form.rating) || 0
    if (rating < 0) rating = 0
    if (rating > 5) rating = 5

    var review = {
      rating: rating,
      highlights: (form.highlights || '').trim(),
      regrets: (form.regrets || '').trim(),
      nextAdvice: (form.nextAdvice || '').trim(),
      updatedAt: new Date().toISOString()
    }

    var trip = this.data.trip
    try { this.updateCurrentTrip({ review: review }) } catch (e) { return }
    if ((trip.source === 'remote' || (trip.id + '').indexOf('remote_') === 0) && (trip.remoteId || parseInt((trip.id + '').replace('remote_', ''), 10))) { api.saveTripReview(trip.remoteId, review).catch(function(){ wx.showToast({title:'云端同步失败，已保留在本机',icon:'none',duration:2000}) }) }
    trip.review = review
    var reviewDateText = this.formatReviewDate(review)
    this.setData({
      trip: trip,
      isEditingReview: false,
      reviewDateText: reviewDateText,
      reviewForm: { rating: 0, highlights: '', regrets: '', nextAdvice: '' }
    })
    wx.showToast({ title: '复盘已保存', icon: 'success', duration: 1500 })
  },

  /* ========== Status Actions ========== */

  onStartTrip() {
    var self = this
    auth.ensureLogin({ title: '需要登录', content: '登录后可管理行程状态，同步行程数据。' }).then(function (loggedIn) {
      if (!loggedIn) return
      self._doStartTrip()
    })
  },

  _doStartTrip() {
    var trip = this.data.trip
    if (!trip || trip.status !== 'upcoming') return
    var self = this
    wx.showModal({
      title: '开始行程',
      content: '确定要开始「' + (trip.customName || trip.routeName || '该行程') + '」吗？',
      confirmText: '开始', confirmColor: '#1f8f5f',
      success: function (res) {
        if (!res.confirm) return
        self.updateTripStatus('active', 'startedAt')
      }
    })
  },

  onCompleteTrip() {
    var self = this
    auth.ensureLogin({ title: '需要登录', content: '登录后可管理行程状态，同步行程数据。' }).then(function (loggedIn) {
      if (!loggedIn) return
      self._doCompleteTrip()
    })
  },

  _doCompleteTrip() {
    var trip = this.data.trip
    if (!trip || trip.status !== 'active') return
    var self = this
    wx.showModal({
      title: '完成行程',
      content: '确定要将「' + (trip.customName || trip.routeName || '该行程') + '」标记为已完成吗？',
      confirmText: '完成', confirmColor: '#1f8f5f',
      success: function (res) {
        if (!res.confirm) return
        self.updateTripStatus('completed', 'completedAt')
      }
    })
  },

  updateTripStatus(newStatus, timeField) {
    var trip = this.data.trip
    if (!trip) return
    trip.status = newStatus
    trip[timeField] = new Date().toISOString()
    try { this.updateCurrentTrip({ status: trip.status, startedAt: trip.startedAt, completedAt: trip.completedAt }) } catch (e) { return }
    if ((trip.source === 'remote' || (trip.id + '').indexOf('remote_') === 0) && (trip.remoteId || parseInt((trip.id + '').replace('remote_', ''), 10))) { api.updateTrip(trip.remoteId, { status: newStatus }).catch(function(){}) }
    var statusInfo = this.getStatusInfo(trip.status)
    this.setData({
      trip: trip,
      statusText: statusInfo.text,
      statusClass: statusInfo.className,
      statusSafetyTitle: this.getStatusSafetyTitle(newStatus),
      safetyAlerts: this.computeSafety(trip)
    })
    wx.showToast({ title: newStatus === 'active' ? '行程已开始' : '行程已完成', icon: 'success', duration: 1500 })
  },

  /* ========== Other Actions ========== */

  onViewOriginalRoute() {
    var trip = this.data.trip
    if (!trip || !trip.routeId) { wx.showToast({ title: '暂无路线信息', icon: 'none' }); return }
    wx.navigateTo({ url: '/pages/route-detail/route-detail?id=' + trip.routeId })
  },

  onAskAI() {
    var trip = this.data.trip
    if (!trip) return
    var travelDateText = this.data.travelDateText || ''
    var checklistProgress = this.getChecklistProgress(trip.safetyChecklist || [])
    wx.setStorageSync('qianxing_pending_context', {
      contextType: 'trip',
      tripId: trip.id,
      tripName: trip.customName || trip.routeName,
      tripSummary: (trip.dayCount || trip.days) + '天' + (trip.spotCount || 0) + '个景点，体力' + (trip.energyLevel || '适中'),
      status: trip.status,
      dayCount: trip.dayCount || trip.days,
      energyLevel: trip.energyLevel || '适中',
      spotNames: trip.spotNames || [],
      travelDateText: travelDateText,
      checklistProgress: checklistProgress,
      source: 'trip-detail'
    })
    wx.switchTab({ url: '/pages/guide/guide' })
  },

  onDeleteTrip() {
    var trip = this.data.trip
    if (!trip) return
    var self = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除「' + (trip.customName || trip.routeName || '该行程') + '」吗？删除后无法恢复。',
      confirmText: '删除', confirmColor: '#ef4444',
      success: function (res) {
        if (!res.confirm) return
        var done = function () {
          wx.showToast({ title: '已删除', icon: 'success', duration: 1200 })
          setTimeout(function () { wx.switchTab({ url: '/pages/my-trips/my-trips' }) }, 1200)
        }
        if ((trip.source === 'remote' || (trip.id + '').indexOf('remote_') === 0) && (trip.remoteId || parseInt((trip.id + '').replace('remote_', ''), 10))) {
          var rid = trip.remoteId || parseInt((trip.id + "").replace("remote_", ""), 10); api.deleteTrip(rid).then(done).catch(function () { self._localDelete(trip, done) })
        } else {
          self._localDelete(trip, done)
        }
      }
    })
  },

  _localDelete: function (trip, done) {
    try {
      tripStorage.deleteTrip(trip.id || trip.localId)
      var app = getApp()
      if (app && app.globalData) app.globalData.myTrips = tripStorage.getTrips()
      done()
    } catch (e) { wx.showToast({ title: '删除失败，请重试', icon: 'none' }) }
  },

  onViewScenic(e) {
    var id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: '/pages/scenic-detail/scenic-detail?id=' + id })
  },

  onGoBack() {
    var pages = getCurrentPages()
    if (pages.length > 1) { wx.navigateBack() }
    else { wx.switchTab({ url: '/pages/my-trips/my-trips' }) }
  }
})
