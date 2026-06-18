// 黔行智导 · 后端 API 请求封装
// 统一处理 wx.request、JWT token、错误码
var BASE_URL = 'http://localhost:8080'

function request(path, options) {
  options = options || {}
  var method = options.method || 'GET'
  var data = options.data || null
  var params = options.params || {}
  var needAuth = options.needAuth || false

  return new Promise(function (resolve, reject) {
    // 构建 query string
    var queryParts = []
    Object.keys(params).forEach(function (key) {
      var val = params[key]
      if (val !== null && val !== undefined && val !== '') {
        queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(val))
      }
    })
    var fullPath = path + (queryParts.length ? '?' + queryParts.join('&') : '')

    // 请求头
    var header = { 'Content-Type': 'application/json' }
    if (needAuth) {
      var token = wx.getStorageSync('qianxing_auth_token')
      if (token) {
        header['Authorization'] = 'Bearer ' + token
      }
    }

    wx.request({
      url: BASE_URL + fullPath,
      method: method,
      header: header,
      data: data,
      success: function (res) {
        var body = res.data
        if (res.statusCode === 401) {
          wx.removeStorageSync('qianxing_auth_token')
          wx.removeStorageSync('qianxing_auth_user')
          wx.reLaunch({ url: '/pages/login/login' })
          reject({ code: 401, message: body ? body.message : '登录已过期' })
          return
        }
        if (body && body.code === 0) {
          resolve(body.data)
        } else if (body) {
          reject({ code: body.code || res.statusCode, message: body.message || '请求失败' })
        } else {
          reject({ code: res.statusCode, message: '服务响应异常' })
        }
      },
      fail: function (err) {
        reject({ code: -1, message: '网络请求失败，请检查网络连接' })
      }
    })
  })
}

// ============ 公开接口 ============

function getScenicSpots(params) {
  return request('/api/app/scenic/spots', { params: params })
}

function getScenicSpot(id) {
  return request('/api/app/scenic/spots/' + id)
}

function getRoutes(params) {
  return request('/api/app/routes', { params: params })
}

function getRoute(id) {
  return request('/api/app/routes/' + id)
}

function getRouteDays(routeId) {
  return request('/api/app/routes/' + routeId + '/days')
}

function getRouteSpots(routeId) {
  return request('/api/app/routes/' + routeId + '/spots')
}

function getRouteRecommend(params) {
  return request('/api/app/routes/recommend', { params: params })
}

function getMediaAssets(params) {
  return request('/api/app/media/assets', { params: params })
}

function getKnowledgeArticles(params) {
  return request('/api/app/knowledge/articles', { params: params })
}

function getKnowledgeArticle(id) {
  return request('/api/app/knowledge/articles/' + id)
}

function searchKnowledge(keyword) {
  return request('/api/app/knowledge/search', { params: { keyword: keyword } })
}

function getKnowledgeRelations(params) {
  return request('/api/app/knowledge/relations', { params: params })
}

function getScenicWeather(scenicId) {
  return request('/api/app/weather/scenic/' + scenicId)
}

function refreshWeather() {
  return request('/api/app/weather/refresh', { method: 'POST' })
}

// ============ 登录接口 ============

function wechatLogin(code, nickname, avatarUrl) {
  return request('/api/app/auth/wechat-login', {
    method: 'POST',
    data: { code: code, nickname: nickname, avatarUrl: avatarUrl }
  })
}

function getUserMe() {
  return request('/api/app/user/me', { needAuth: true })
}

function getTrips(params) {
  return request('/api/app/trips', { params: params, needAuth: true })
}

function getTrip(id) {
  return request('/api/app/trips/' + id, { needAuth: true })
}

function createTrip(trip) {
  return request('/api/app/trips', { method: 'POST', data: trip, needAuth: true })
}

function updateTrip(id, patch) {
  return request('/api/app/trips/' + id, { method: 'PUT', data: patch, needAuth: true })
}

function deleteTrip(id) {
  return request('/api/app/trips/' + id, { method: 'DELETE', needAuth: true })
}

function getTripDays(tripId) {
  return request('/api/app/trips/' + tripId + '/days', { needAuth: true })
}

function updateTripDay(tripId, dayId, patch) {
  return request('/api/app/trips/' + tripId + '/days/' + dayId, { method: 'PUT', data: patch, needAuth: true })
}

function getTripSafetyItems(tripId) {
  return request('/api/app/trips/' + tripId + '/safety-items', { needAuth: true })
}

function updateTripSafetyItem(tripId, itemId, patch) {
  return request('/api/app/trips/' + tripId + '/safety-items/' + itemId, { method: 'PUT', data: patch, needAuth: true })
}

function saveTripReview(tripId, review) {
  return request('/api/app/trips/' + tripId + '/review', { method: 'PUT', data: review, needAuth: true })
}

function createAiPlan(planRequest) {
  return request('/api/app/ai/plans', { method: 'POST', data: planRequest, needAuth: true })
}

function getAiPlan(requestId) {
  return request('/api/app/ai/plans/' + requestId, { needAuth: true })
}

function aiChat(question) {
  return request('/api/app/ai/chat', { method: 'POST', data: { question: question }, needAuth: true })
}
function createAiPlanDraft(params) { return request('/api/app/ai/plan-drafts', { method: 'POST', data: params, needAuth: true }) }
function getAiPlanDraft(draftId) { return request('/api/app/ai/plan-drafts/' + draftId, { needAuth: true }) }
function confirmAiPlanDraft(draftId) { return request('/api/app/ai/plan-drafts/' + draftId + '/confirm', { method: 'POST', needAuth: true }) }

module.exports = {
  BASE_URL: BASE_URL,
  request: request,
  getScenicSpots: getScenicSpots,
  getScenicSpot: getScenicSpot,
  getRoutes: getRoutes,
  getRoute: getRoute,
  getRouteDays: getRouteDays,
  getRouteSpots: getRouteSpots,
  getRouteRecommend: getRouteRecommend,
  getMediaAssets: getMediaAssets,
  getKnowledgeArticles: getKnowledgeArticles,
  getKnowledgeArticle: getKnowledgeArticle,
  searchKnowledge: searchKnowledge,
  getKnowledgeRelations: getKnowledgeRelations,
  getScenicWeather: getScenicWeather,
  refreshWeather: refreshWeather,
  wechatLogin: wechatLogin,
  getUserMe: getUserMe,
  getTrips: getTrips,
  getTrip: getTrip,
  createTrip: createTrip,
  updateTrip: updateTrip,
  deleteTrip: deleteTrip,
  getTripDays: getTripDays,
  updateTripDay: updateTripDay,
  getTripSafetyItems: getTripSafetyItems,
  updateTripSafetyItem: updateTripSafetyItem,
  saveTripReview: saveTripReview,
  createAiPlan: createAiPlan,
  getAiPlan: getAiPlan,
  aiChat: aiChat,
  createAiPlanDraft: createAiPlanDraft,
  getAiPlanDraft: getAiPlanDraft,
  confirmAiPlanDraft: confirmAiPlanDraft
}
