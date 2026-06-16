// guide-trip-rules.js
// Trip rule matching — pure functions extracted from guide.js (V16-B)

var CN_NUMS = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 }

function extractDayNumber(msg) {
  var m = msg.match(/第\s*(\d+)\s*天/)
  if (m) return parseInt(m[1], 10)
  for (var key in CN_NUMS) {
    if (msg.indexOf('第' + key + '天') !== -1) return CN_NUMS[key]
  }
  return null
}

function getTripStatusText(status) {
  if (status === 'active') return '进行中'
  if (status === 'completed') return '已完成'
  return '未开始'
}

function getTripStatusHint(status) {
  if (status === 'active') return '你正在旅行中，注意安全，合理分配体力。'
  if (status === 'completed') return '你已完成这段行程，欢迎回顾路线或计划下一次贵州之旅。'
  return '出发前请完成准备清单，祝你旅途愉快！'
}

function generateTripSafetyTips(trip) {
  var tips = []
  var energyLevel = trip.energyLevel || trip.physicalLevel || '适中'
  var spotNames = trip.spotNames || []

  if (energyLevel === '挑战') {
    tips.push('本行程体力消耗较大，务必准备防滑鞋和充足饮水，避免单独前往偏远路段。')
  } else if (energyLevel === '适中') {
    tips.push('本行程体力消耗适中，建议合理安排每日游览节奏。')
  } else {
    tips.push('本行程节奏轻松，适合悠闲游览，可根据个人状态自由调整行程。')
  }

  var hasWaterfall = false, hasMountain = false
  spotNames.forEach(function (name) {
    if (!name) return
    if (name.indexOf('瀑布') !== -1) hasWaterfall = true
    if (name.indexOf('山') !== -1 || name.indexOf('峰') !== -1 || name.indexOf('岭') !== -1) hasMountain = true
  })
  if (hasWaterfall) tips.push('行程含瀑布景点，栈道可能湿滑，请注意脚下安全。')
  if (hasMountain) tips.push('行程含山地景点，海拔变化较大，注意体力分配。')

  tips.push('贵州山区天气多变，建议随身携带雨具和薄外套。')
  if (tips.length > 3) tips = tips.slice(0, 3)
  return tips
}

function tripRuleMatch(msg, trip) {
  if (!trip) return null

  var dayNum = extractDayNumber(msg)
  if (dayNum !== null || msg.indexOf('每天') !== -1 || msg.indexOf('每日') !== -1 || (msg.indexOf('怎么玩') !== -1 && msg.indexOf('安排') === -1)) {
    return matchTripDayPlan(msg, trip, dayNum)
  }

  if (/安全|准备|缺|注意事项|需要带|清单|带什么/.test(msg)) {
    return matchTripSafety(trip)
  }

  if (/复盘|评价|评分|亮点|遗憾|不足|下次建议|下次怎么优化|记录了|这次体验|这次怎么样|旅行复盘|我的复盘|完成后感受/.test(msg)) {
    return matchTripReview(msg, trip)
  }

  if (/出发|开始|完成|状态|日期|什么时候|几号/.test(msg)) {
    return matchTripStatus(trip)
  }

  if (/总结|概览|介绍|怎么样|安排|行程|这条/.test(msg)) {
    return matchTripOverview(trip)
  }

  return null
}

function matchTripOverview(trip) {
  var name = trip.customName || trip.routeName || '你的行程'
  var dayCount = trip.dayCount || trip.days || 1
  var spotCount = trip.spotCount || (trip.spotNames ? trip.spotNames.length : 0)
  var energyLevel = trip.energyLevel || trip.physicalLevel || '适中'
  var spotNames = trip.spotNames || []
  var travelStartDate = trip.travelStartDate
  var travelEndDate = trip.travelEndDate
  var statusText = getTripStatusText(trip.status)

  var lines = []
  lines.push('「' + name + '」是您的贵州山地旅行行程，共 ' + dayCount + ' 天 ' + spotCount + ' 个景点，体力强度' + energyLevel + '。')

  if (travelStartDate) {
    var sd = new Date(travelStartDate)
    if (travelEndDate) {
      var ed = new Date(travelEndDate)
      if (!isNaN(sd.getTime()) && !isNaN(ed.getTime())) {
        lines.push('出行日期：' + (sd.getMonth() + 1) + '月' + sd.getDate() + '日 — ' + (ed.getMonth() + 1) + '月' + ed.getDate() + '日。')
      }
    } else if (!isNaN(sd.getTime())) {
      lines.push('出行日期：' + (sd.getMonth() + 1) + '月' + sd.getDate() + '日。')
    }
  } else {
    lines.push('出行日期待设置。')
  }

  lines.push('当前状态：' + statusText + '。')
  lines.push(getTripStatusHint(trip.status))

  if (spotNames.length > 0) {
    lines.push('景点包括：' + spotNames.join('、') + '。')
  }

  return lines.join('\n')
}

function matchTripDayPlan(msg, trip, dayNum) {
  var dayPlans = trip.dayPlans
  if (!dayPlans || dayPlans.length === 0) {
    return '当前行程暂未生成每日安排，你可以先在行程详情中查看路线信息。'
  }

  if (dayNum !== null && dayNum >= 1 && dayNum <= dayPlans.length) {
    var plan = dayPlans[dayNum - 1]
    var lines = []
    lines.push('第' + dayNum + '天 · ' + (plan.title || '第' + dayNum + '天'))
    if (plan.description) lines.push('说明：' + plan.description)
    if (plan.meals) lines.push('餐饮建议：' + plan.meals)
    if (plan.accommodation) lines.push('住宿建议：' + plan.accommodation)
    return lines.join('\n')
  }

  if (dayNum !== null && (dayNum < 1 || dayNum > dayPlans.length)) {
    return '您的行程只有 ' + dayPlans.length + ' 天，请输入 1-' + dayPlans.length + ' 之间的天数。'
  }

  var lines2 = []
  lines2.push('您的行程共 ' + dayPlans.length + ' 天：')
  for (var i = 0; i < dayPlans.length; i++) {
    var p = dayPlans[i]
    var edited = p.isEdited ? ' [已调整]' : ''
    lines2.push('第' + p.day + '天 · ' + (p.title || '第' + p.day + '天') + edited)
  }
  lines2.push('')
  lines2.push('你可以问我"第一天怎么玩"了解每天的详细安排。')
  return lines2.join('\n')
}

function matchTripSafety(trip) {
  var checklist = trip.safetyChecklist || []
  var lines = []

  if (checklist.length === 0) {
    lines.push('出行准备清单暂未生成。')
  } else {
    var checked = []
    var unchecked = []
    checklist.forEach(function (item) {
      if (item.checked) checked.push(item.text)
      else unchecked.push(item.text)
    })

    if (checked.length === checklist.length) {
      lines.push('出行准备清单已全部完成！共 ' + checklist.length + ' 项全部就绪。')
    } else {
      lines.push('出行准备清单已完成 ' + checked.length + '/' + checklist.length + ' 项。')

      if (unchecked.length > 0) {
        var showUnchecked = unchecked.slice(0, 5)
        lines.push('还需准备：')
        showUnchecked.forEach(function (t) { lines.push('· ' + t) })
        if (unchecked.length > 5) lines.push('...还有 ' + (unchecked.length - 5) + ' 项')
      }

      if (checked.length > 0) {
        var showChecked = checked.slice(0, 3)
        lines.push('已完成：')
        showChecked.forEach(function (t) { lines.push('· ' + t) })
      }
    }
  }

  var tips = generateTripSafetyTips(trip)
  if (tips.length > 0) {
    lines.push('')
    lines.push('安全提醒：')
    tips.forEach(function (t) { lines.push('· ' + t) })
  }

  return lines.join('\n')
}

function matchTripReview(msg, trip) {
  var review = trip.review || {}
  var hasReview = review.rating > 0 || review.highlights || review.regrets || review.nextAdvice

  if (trip.status !== 'completed') {
    if (trip.status === 'active') {
      return '这条行程正在进行中，行程结束后可以记录复盘。'
    }
    return '这条行程还没有完成，复盘会在完成行程后用于记录你的旅行体验。'
  }

  if (!hasReview) {
    return '这条行程已经完成，但还没有记录复盘。你可以回到行程详情页，记录本次旅行体验、亮点、遗憾和下次建议。'
  }

  var name = trip.customName || trip.routeName || '你的行程'
  var lines = []
  lines.push('你为「' + name + '」留下了这次旅行复盘：')
  lines.push('')

  if (review.rating > 0) {
    lines.push('本次评分：' + review.rating + '/5')
  }
  if (review.highlights) {
    lines.push('本次亮点：' + review.highlights)
  }
  if (review.regrets) {
    lines.push('遗憾与不足：' + review.regrets)
  }
  if (review.nextAdvice) {
    lines.push('下次建议：' + review.nextAdvice)
  }
  if (review.updatedAt) {
    try {
      var d = new Date(review.updatedAt)
      if (!isNaN(d.getTime())) {
        lines.push('最后更新：' + (d.getMonth() + 1) + '月' + d.getDate() + '日')
      }
    } catch (e) { /* ignore */ }
  }

  return lines.join('\n')
}

function matchTripStatus(trip) {
  var travelStartDate = trip.travelStartDate
  var travelEndDate = trip.travelEndDate
  var statusText = getTripStatusText(trip.status)

  var lines = []
  if (travelStartDate) {
    var sd = new Date(travelStartDate)
    if (!isNaN(sd.getTime())) {
      var dateStr = (sd.getMonth() + 1) + '月' + sd.getDate() + '日'
      if (travelEndDate) {
        var ed = new Date(travelEndDate)
        if (!isNaN(ed.getTime())) {
          dateStr = dateStr + ' — ' + (ed.getMonth() + 1) + '月' + ed.getDate() + '日'
        }
      }
      lines.push('出行日期：' + dateStr + '。')
    }
  } else {
    lines.push('出行日期尚未设置。')
  }

  lines.push('当前状态：' + statusText + '。')
  lines.push('提示：行程状态由你手动开始或完成，不会根据日期自动判断。')
  lines.push(getTripStatusHint(trip.status))

  return lines.join('\n')
}

module.exports = {
  CN_NUMS: CN_NUMS,
  extractDayNumber: extractDayNumber,
  getTripStatusText: getTripStatusText,
  getTripStatusHint: getTripStatusHint,
  generateTripSafetyTips: generateTripSafetyTips,
  tripRuleMatch: tripRuleMatch,
  matchTripOverview: matchTripOverview,
  matchTripDayPlan: matchTripDayPlan,
  matchTripSafety: matchTripSafety,
  matchTripReview: matchTripReview,
  matchTripStatus: matchTripStatus
}
