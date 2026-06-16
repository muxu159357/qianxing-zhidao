// guide-attraction-rules.js
// Attraction rule matching — pure functions extracted from guide.js (V16-A)

function attractionRuleMatch(msg, attr) {
  if (!attr || !attr.attractionId) return null

  var name = attr.attractionName || ''

  if (/怎么玩|介绍一下|怎么样|概览|怎么游玩/.test(msg)) {
    return matchAttractionOverview(attr)
  }
  if (/亮点|特色|看什么|值得|好看/.test(msg)) {
    return matchAttractionHighlights(attr)
  }
  if (/注意|提醒|准备|安全|要带|带什么/.test(msg)) {
    return matchAttractionTips(attr)
  }
  if (/适合|老人|亲子|徒步|累|小孩|孩子|体力/.test(msg)) {
    return matchAttractionSuitableCrowd(attr)
  }
  if (/路线|相关|包含|安排路线|附近/.test(msg)) {
    return matchAttractionRoutes(attr)
  }

  if (name && msg.indexOf(name) !== -1) {
    return matchAttractionOverview(attr)
  }

  return null
}

function matchAttractionOverview(attr) {
  var lines = []
  var name = attr.attractionName || '未知景点'
  var city = attr.city || '贵州省'
  var rating = attr.rating || 0
  var price = attr.price || ''
  var duration = attr.duration || ''
  var desc = attr.description || ''

  lines.push('「' + name + '」位于' + city + '。')
  if (rating) lines.push('评分：' + rating + '/5')
  if (price && price !== '免费') lines.push('门票：' + price + '元')
  if (price === '免费') lines.push('门票：免费')
  if (duration) lines.push('建议游玩时长：' + duration)
  if (desc) {
    lines.push('')
    lines.push(desc)
  }
  return lines.join('\n')
}

function matchAttractionHighlights(attr) {
  var name = attr.attractionName || '该景点'
  var highlights = attr.highlights
  var desc = attr.description || ''

  if (!highlights || highlights.length === 0) {
    if (desc) {
      return '「' + name + '」暂无详细亮点清单，以下是简介：\n' + desc
    }
    return '「' + name + '」暂无详细亮点清单，但贵州的每一处山水都有独特的魅力等待你去发现。'
  }

  var lines = []
  lines.push('「' + name + '」的精彩亮点：')
  lines.push('')
  for (var i = 0; i < highlights.length; i++) {
    lines.push('· ' + highlights[i])
  }
  return lines.join('\n')
}

function matchAttractionTips(attr) {
  var name = attr.attractionName || '该景点'
  var tips = attr.tips

  var lines = []
  lines.push('「' + name + '」出行建议：')
  lines.push('')

  if (tips && tips.length > 0) {
    for (var i = 0; i < tips.length; i++) {
      lines.push('· ' + tips[i])
    }
    lines.push('')
  }

  lines.push('此外，到贵州山地景区游览，建议穿着防滑鞋、随身携带雨具和饮用水，注意防晒。')

  return lines.join('\n')
}

function matchAttractionSuitableCrowd(attr) {
  var name = attr.attractionName || '该景点'
  var tags = attr.tags || []
  var category = attr.category || ''
  var tagStr = tags.join(' ') + ' ' + category

  var lines = []
  lines.push('关于「' + name + '」适合哪些人：')
  lines.push('')

  if (tagStr.indexOf('亲子') !== -1) {
    lines.push('该景点适合亲子家庭，可以带孩子领略贵州山水的多彩魅力。')
  }
  if (tagStr.indexOf('户外') !== -1 || tagStr.indexOf('探险') !== -1) {
    lines.push('该景点适合喜欢户外运动的游客，建议有一定体力基础，穿徒步鞋或防滑鞋。')
  }
  if (tagStr.indexOf('古镇') !== -1 || tagStr.indexOf('民族文化') !== -1) {
    lines.push('该景点节奏轻松，适合各年龄段人群，尤其适合对贵州民族文化感兴趣的游客。')
  }
  if (tagStr.indexOf('自然风光') !== -1 && tagStr.indexOf('古镇') === -1 && tagStr.indexOf('探险') === -1) {
    lines.push('该景点适合大多数游客，可根据自身体力选择合适的游览节奏。')
  }
  if (tagStr.indexOf('避暑') !== -1 || tagStr.indexOf('康养') !== -1) {
    lines.push('该景点气候宜人、节奏轻松，特别适合避暑康养和银发人群。')
  }

  if (lines.length === 2) {
    lines.push('该景点适合大多数游客，建议根据自身体力和偏好合理安排游览计划。')
  }

  return lines.join('\n')
}

function matchAttractionRoutes(attr) {
  var attractionId = attr.attractionId
  if (!attractionId) return null

  var routes = []
  try {
    var mock = require('../../utils/mock')
    routes = mock.routes || []
  } catch (e) {
    routes = []
  }

  if (!routes.length) {
    return '暂未找到包含该景点的路线信息，你可以在景点详情页查看相关路线推荐。'
  }

  var matched = routes.filter(function (route) {
    return route.attractionIds && route.attractionIds.some(function (aid) {
      return String(aid) === String(attractionId)
    })
  })

  if (!matched.length) {
    return '暂未找到包含「' + (attr.attractionName || '该景点') + '」的推荐路线。你可以在知识库或路线推荐页面发现更多行程。'
  }

  var lines = []
  lines.push('包含「' + (attr.attractionName || '该景点') + '」的路线：')
  lines.push('')
  var maxShow = Math.min(matched.length, 3)
  for (var i = 0; i < maxShow; i++) {
    var r = matched[i]
    lines.push((i + 1) + '. ' + r.name + '（' + r.days + '天 · ' + r.physicalLevel + '）')
  }
  lines.push('')
  lines.push('你可以在景点详情页查看完整相关路线，或回到路线推荐页面发现更多行程。')

  return lines.join('\n')
}

module.exports = {
  attractionRuleMatch: attractionRuleMatch,
  matchAttractionOverview: matchAttractionOverview,
  matchAttractionHighlights: matchAttractionHighlights,
  matchAttractionTips: matchAttractionTips,
  matchAttractionSuitableCrowd: matchAttractionSuitableCrowd,
  matchAttractionRoutes: matchAttractionRoutes
}
