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

// ============ 行程适配 ============

function backendTripToUnified(apiTrip) {
  if (!apiTrip) return null
  return {
    source: 'remote',
    remoteId: apiTrip.id,
    id: 'remote_' + apiTrip.id,
    routeId: apiTrip.routeId,
    routeName: apiTrip.routeName || '',
    customName: apiTrip.customName || null,
    displayName: apiTrip.customName || apiTrip.routeName || '',
    status: apiTrip.status || 'upcoming',
    days: apiTrip.dayCount || 1,
    dayCount: apiTrip.dayCount || 1,
    physicalLevel: apiTrip.energyLevel || '适中',
    energyLevel: apiTrip.energyLevel || '适中',
    spotCount: 0,
    spotNames: [],
    spotIds: [],
    dayPlans: [],
    score: 0,
    savedAt: apiTrip.createdAt || '',
    _rawSavedAt: apiTrip.createdAt || '',
    startedAt: apiTrip.startedAt || null,
    completedAt: apiTrip.completedAt || null,
    travelStartDate: apiTrip.travelStartDate || null,
    travelEndDate: apiTrip.travelEndDate || null,
    safetyChecklist: [],
    review: { rating: 0, highlights: '', regrets: '', nextAdvice: '', updatedAt: null },
    routeSnapshotJson: apiTrip.routeSnapshotJson || null,
    planSnapshotJson: apiTrip.planSnapshotJson || null
  }
}

function localTripToUnified(trip) {
  if (!trip) return null
  return {
    source: 'local',
    localId: trip.id,
    remoteId: null,
    id: trip.id,
    routeId: trip.routeId,
    routeName: trip.routeName || '',
    customName: trip.customName || null,
    displayName: trip.customName || trip.routeName || '',
    status: trip.status || 'upcoming',
    days: trip.dayCount || trip.days || 1,
    dayCount: trip.dayCount || trip.days || 1,
    physicalLevel: trip.energyLevel || trip.physicalLevel || '适中',
    energyLevel: trip.energyLevel || trip.physicalLevel || '适中',
    spotCount: trip.spotCount || (trip.spotNames ? trip.spotNames.length : 0),
    spotNames: trip.spotNames || [],
    spotIds: trip.spotIds || [],
    dayPlans: trip.dayPlans || [],
    score: trip.score || 0,
    savedAt: trip.savedAt || trip._rawSavedAt || '',
    _rawSavedAt: trip._rawSavedAt || trip.savedAt || '',
    startedAt: trip.startedAt || null,
    completedAt: trip.completedAt || null,
    travelStartDate: trip.travelStartDate || null,
    travelEndDate: trip.travelEndDate || null,
    safetyChecklist: trip.safetyChecklist || [],
    review: trip.review || { rating: 0, highlights: '', regrets: '', nextAdvice: '', updatedAt: null }
  }
}

function unifiedTripToCreateRequest(trip, route) {
  return {
    routeId: route && route._dbId ? route._dbId : null,
    routeName: trip.routeName || (route ? route.name : ''),
    customName: trip.customName || null,
    status: trip.status || 'upcoming',
    dayCount: trip.dayCount || trip.days || 1,
    energyLevel: trip.energyLevel || trip.physicalLevel || '适中',
    travelStartDate: trip.travelStartDate || null,
    travelEndDate: trip.travelEndDate || null,
    routeSnapshotJson: route ? JSON.stringify(route) : null,
    planSnapshotJson: trip.dayPlans ? JSON.stringify({ dayPlans: trip.dayPlans, spotNames: trip.spotNames }) : null
  }
}

module.exports = {
  parseJsonArray: parseJsonArray,
  scenicSpotToAttraction: scenicSpotToAttraction,
  apiRouteToRoute: apiRouteToRoute,
  articleToKnowledge: articleToKnowledge,
  apiRoutesToRoutes: apiRoutesToRoutes,
  backendTripToUnified: backendTripToUnified,
  localTripToUnified: localTripToUnified,
  unifiedTripToCreateRequest: unifiedTripToCreateRequest
}
