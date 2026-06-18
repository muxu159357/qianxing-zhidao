// pages/my-trips/my-trips.js
var app = getApp();

var tripStorage = require('../../utils/trip-storage')
var auth = require('../../utils/auth')

Page({
  data: {
    trips: [],
    filteredTrips: [],
    activeFilter: 'all',
    filters: [
      { key: 'all', label: '全部' },
      { key: 'upcoming', label: '未开始' },
      { key: 'active', label: '进行中' },
      { key: 'completed', label: '已完成' }
    ],
    emptyTitle: '还没有行程',
    emptyDesc: '去探索景点并规划您的贵州之旅吧',
    tripStats: {
      total: 0,
      upcoming: 0,
      active: 0,
      completed: 0,
      reviewed: 0,
      latestTripName: ''
    }
  },

  onShow() { auth.requireLoginRedirect() },

  onLoad() {
    this.loadTrips();
  },

  onShow() {
    this.loadTrips();
  },

  loadTrips() {
    var trips = [];

    try {
      var stored = wx.getStorageSync('qianxing_trips');
      if (stored && Array.isArray(stored)) {
        trips = stored;
      }
    } catch (e) {
      console.warn('读取行程存储失败:', e);
    }

    if ((!trips || trips.length === 0) && app && app.globalData && app.globalData.myTrips) {
      trips = app.globalData.myTrips;
    }

    var that = this

    trips = trips.map(function (trip, index) {
      return {
        id: trip.id || 'trip_' + index + '_' + Date.now(),
        routeId: trip.routeId || trip.id || '',
        routeName: trip.routeName || trip.name || '未命名行程',
        customName: trip.customName || null,
        displayName: trip.customName || trip.routeName || trip.name || '未命名行程',
        days: trip.days || trip.dayCount || 1,
        dayCount: trip.dayCount || trip.days || 1,
        energyLevel: trip.energyLevel || trip.physicalLevel || '适中',
        spotCount: trip.spotCount || (trip.spotNames ? trip.spotNames.length : 0),
        spotNames: trip.spotNames || [],
        spotIds: trip.spotIds || [],
        dayPlans: trip.dayPlans || [],
        score: trip.score || 0,
        savedAt: that.formatSavedAt(trip.savedAt),
        _rawSavedAt: trip.savedAt || '',
        status: trip.status || 'upcoming',
        startedAt: trip.startedAt || null,
        completedAt: trip.completedAt || null,
        travelStartDate: trip.travelStartDate || null,
        travelEndDate: trip.travelEndDate || null,
        travelDateText: that.formatTravelDate(trip.travelStartDate, trip.travelEndDate),
        review: trip.review || null,
        reviewStatusText: ''
      };
    });

    // Compute review status for completed trips
    trips.forEach(function (trip) {
      if (trip.status === 'completed' && trip.review) {
        var hasReview = trip.review.rating > 0 || trip.review.highlights || trip.review.regrets || trip.review.nextAdvice
        trip.reviewStatusText = hasReview ? '已复盘' : '待复盘'
      }
    })

    // Sort: active → upcoming → completed
    var order = { active: 0, upcoming: 1, completed: 2 };
    trips.sort(function (a, b) {
      return (order[a.status] || 2) - (order[b.status] || 2);
    });

    var tripStats = this.getTripStats(trips)

    this.setData({ trips: trips, tripStats: tripStats }, function () {
      this.applyFilter();
    });
  },

  /* ========== V9: Trip Stats ========== */

  getTripStats(trips) {
    var stats = {
      total: 0,
      upcoming: 0,
      active: 0,
      completed: 0,
      reviewed: 0,
      latestTripName: ''
    }

    if (!trips || trips.length === 0) return stats

    var latestTime = 0

    trips.forEach(function (trip) {
      stats.total++

      if (trip.status === 'upcoming') {
        stats.upcoming++
      } else if (trip.status === 'active') {
        stats.active++
      } else if (trip.status === 'completed') {
        stats.completed++
        if (trip.reviewStatusText === '已复盘') {
          stats.reviewed++
        }
      }

      var timeSource = null
      if (trip.review && trip.review.updatedAt) {
        timeSource = trip.review.updatedAt
      } else if (trip.completedAt) {
        timeSource = trip.completedAt
      } else if (trip._rawSavedAt) {
        timeSource = trip._rawSavedAt
      } else if (trip.savedAt) {
        timeSource = trip.savedAt
      }

      if (timeSource) {
        var t = new Date(timeSource).getTime()
        if (!isNaN(t) && t > latestTime) {
          latestTime = t
          stats.latestTripName = trip.displayName || trip.customName || trip.routeName || ''
        }
      }
    })

    return stats
  },

  applyFilter() {
    var filter = this.data.activeFilter;
    var trips = this.data.trips;
    var filtered = filter === 'all'
      ? trips
      : trips.filter(function (t) { return t.status === filter });

    var emptyInfo = this.getEmptyInfo(filter);
    this.setData({
      filteredTrips: filtered,
      emptyTitle: emptyInfo.title,
      emptyDesc: emptyInfo.desc
    });
  },

  getEmptyInfo(filter) {
    if (filter === 'upcoming') return { title: '没有未开始的行程', desc: '去发现更多路线，规划下一段贵州之旅吧' };
    if (filter === 'active') return { title: '没有进行中的行程', desc: '在未开始的行程中点击「开始行程」即可出发' };
    if (filter === 'completed') return { title: '没有已完成的行程', desc: '完成一次贵州之旅后，相关行程会自动出现在这里' };
    return { title: '还没有行程', desc: '去探索景点并规划您的贵州之旅吧' };
  },

  onFilterTap(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeFilter: key }, function () {
      this.applyFilter();
    });
  },

  formatSavedAt(isoString) {
    if (!isoString) return '最近保存';
    try {
      var d = new Date(isoString);
      if (isNaN(d.getTime())) return '最近保存';
      return (d.getMonth() + 1) + '月' + d.getDate() + '日保存';
    } catch (e) {
      return '最近保存';
    }
  },

  formatTravelDate(startStr, endStr) {
    if (!startStr) return null
    try {
      var startDate = new Date(startStr)
      if (isNaN(startDate.getTime())) return null
      var sm = startDate.getMonth() + 1
      var sd = startDate.getDate()
      if (endStr) {
        var endDate = new Date(endStr)
        if (!isNaN(endDate.getTime())) {
          var em = endDate.getMonth() + 1
          var ed = endDate.getDate()
          if (sm === em && sd === ed) return sm + '月' + sd + '日出发'
          return sm + '月' + sd + '日 — ' + em + '月' + ed + '日出发'
        }
      }
      return sm + '月' + sd + '日出发'
    } catch (e) {
      return null
    }
  },

  onTapTrip(e) {
    var id = e.currentTarget.dataset.id;
    var trip = this.data.trips.find(function (t) { return t.id === id });

    if (!trip) return;

    wx.navigateTo({
      url: '/pages/trip-detail/trip-detail?id=' + trip.id,
      fail: function () {
        wx.showToast({ title: '更多行程服务即将开放', icon: 'none' });
      }
    });
  },

  onDeleteTrip(e) {
    var id = e.currentTarget.dataset.id;
    var trip = this.data.trips.find(function (t) { return t.id === id });

    wx.showModal({
      title: '确认删除',
      content: trip ? '确定要删除「' + (trip.routeName || trip.name || '该行程') + '」吗？' : '确定要删除该行程吗？',
      confirmText: '删除',
      confirmColor: '#ef4444',
      success: function (res) {
        if (res.confirm) {
          this.deleteTrip(id);
        }
      }.bind(this)
    });
  },

  deleteTrip(id) {
    try {
      tripStorage.deleteTrip(id)

      if (app && app.globalData) {
        app.globalData.myTrips = tripStorage.getTrips()
      }
    } catch (e) {
      wx.showToast({ title: '删除失败，请重试', icon: 'none' });
      return;
    }

    this.loadTrips();
    wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
  },

  onGoExplore() {
    wx.switchTab({
      url: '/pages/index/index',
      fail: function () {
        wx.navigateBack();
      }
    });
  }
});
