// 黔行智导 · 字段适配层
// 将后端 API 返回的 camelCase 字段转换为小程序页面期望的格式

function parseJsonArray(val, fallback) {
  fallback = fallback || []
  if (!val) return fallback
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch (e) { return fallback }
  }
  return fallback
}

function scenicSpotToAttraction(spot) {
  if (!spot) return null
  return {
    id: spot.spotCode || String(spot.id),
    _dbId: spot.id,
    name: spot.name,
    city: spot.city,
    category: spot.category || '自然风光',
    rating: spot.rating || 0,
    price: spot.ticketPrice || 0,
    duration: spot.visitDuration || '',
    bestSeason: spot.bestSeason || '',
    description: spot.description || '',
    highlights: parseJsonArray(spot.highlights),
    tips: parseJsonArray(spot.tips),
    tags: parseJsonArray(spot.tags),
    imageUrl: null,
    imageGradient: null,
    latitude: spot.latitude,
    longitude: spot.longitude
  }
}

function apiRouteToRoute(apiRoute, days, spots) {
  if (!apiRoute) return null
  var route = {
    id: apiRoute.routeCode || String(apiRoute.id),
    _dbId: apiRoute.id,
    name: apiRoute.name,
    description: apiRoute.description || '',
    days: apiRoute.dayCount || 0,
    dayCount: apiRoute.dayCount || 0,
    physicalLevel: apiRoute.energyLevel || '适中',
    energyLevel: apiRoute.energyLevel || '适中',
    budgetRange: apiRoute.budgetRange || '',
    suitableFor: parseJsonArray(apiRoute.suitableCrowd),
    tags: parseJsonArray(apiRoute.tags),
    theme: apiRoute.theme || '',
    coverImage: apiRoute.coverImage || null,
    attractionIds: [],
    dailyPlan: [],
    _spotRelations: []
  }

  if (days && days.length > 0) {
    route.dailyPlan = days.map(function (d) {
      return {
        day: d.dayNumber,
        title: d.title,
        description: d.description || '',
        meals: d.meals || '',
        accommodation: d.accommodation || ''
      }
    })
    route.attractionIds = days.map(function (d) { return d.title }).filter(Boolean)
  }

  if (spots && spots.length > 0) {
    route._spotRelations = spots.map(function (s) {
      return { dayId: s.routeDayId, scenicSpotId: s.scenicSpotId, order: s.spotOrder, tip: s.visitTip }
    })
  }

  return route
}

function articleToKnowledge(article) {
  if (!article) return null
  return {
    id: article.articleCode || String(article.id),
    _dbId: article.id,
    question: article.question,
    answer: article.answer,
    category: article.category,
    relatedAttractionIds: []
  }
}

function apiRoutesToRoutes(apiRoutes) {
  if (!apiRoutes || !apiRoutes.length) return []
  return apiRoutes.map(function (r) { return apiRouteToRoute(r) }).filter(Boolean)
}

module.exports = {
  parseJsonArray: parseJsonArray,
  scenicSpotToAttraction: scenicSpotToAttraction,
  apiRouteToRoute: apiRouteToRoute,
  articleToKnowledge: articleToKnowledge,
  apiRoutesToRoutes: apiRoutesToRoutes
}
