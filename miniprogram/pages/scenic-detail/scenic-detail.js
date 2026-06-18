// pages/scenic-detail/scenic-detail.js
var mock = require('../../utils/mock');
var auth = require('../../utils/auth')
var assetResolver = require('../../utils/asset-resolver');
var api = require('../../utils/api');
var adapters = require('../../utils/adapters');

Page({
  data: {
    attraction: null,
    relatedRoutes: [],
    scenicCoverImage: ''
  },

  onShow() { if (!auth.requireLoginRedirect()) return },

  onLoad(options) {
    var id = options.id;
    if (!id) {
      this.setData({ attraction: null });
      return;
    }

    var self = this;
    api.getScenicSpots({ keyword: id, size: 10 }).then(function (data) {
      var records = data.records || [];
      var spot = null;
      for (var i = 0; i < records.length; i++) {
        if (records[i].spotCode === id) { spot = records[i]; break; }
      }
      if (spot) {
        var attraction = adapters.scenicSpotToAttraction(spot);
        var coverImage = assetResolver.resolveAttractionCover(attraction);
        self.setData({ attraction: attraction, scenicCoverImage: coverImage });
        self._loadRelatedRoutes(attraction);
      } else {
        self._loadFromMock(id);
      }
    }).catch(function () {
      self._loadFromMock(id);
    });
  },

  _loadFromMock: function (id) {
    var attraction = mock.getAttractionById
      ? mock.getAttractionById(id)
      : (mock.attractions || []).find(function (item) { return item.id == id || item.id === id; });

    if (attraction) {
      var coverImage = assetResolver.resolveAttractionCover(attraction);
      this.setData({ attraction: attraction, scenicCoverImage: coverImage });
      this._loadRelatedRoutes(attraction);
    } else {
      this.setData({ attraction: null, relatedRoutes: [] });
    }
  },

  onGoBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  _loadRelatedRoutes: function (attraction) {
    var routes = mock.routes || [];
    var selection = null;
    try {
      selection = wx.getStorageSync('qianxing_selection') || null;
    } catch (e) {
      selection = null;
    }
    var related = this._buildRelatedRoutes(attraction, routes, selection);
    this.setData({ relatedRoutes: related });
  },

  _buildRelatedRoutes: function (attraction, routes, selection) {
    if (!attraction || !attraction.id || !routes || !routes.length) return [];

    var attractionId = attraction.id;
    var self = this;

    var matched = routes.filter(function (route) {
      return route.attractionIds && route.attractionIds.some(function (aid) {
        return String(aid) === String(attractionId);
      });
    });

    if (!matched.length) return [];

    if (selection && selection.days) {
      matched.sort(function (a, b) {
        return Math.abs(a.days - selection.days) - Math.abs(b.days - selection.days);
      });
    }

    return matched.slice(0, 3).map(function (route) {
      return {
        id: route.id,
        name: route.name,
        days: route.days,
        physicalLevel: route.physicalLevel,
        budgetRange: route.budgetRange || '',
        summary: self._buildRelatedRouteSummary(route, attraction)
      };
    });
  },

  _buildRelatedRouteSummary: function (route) {
    if (route.description && route.description.length > 0) {
      return route.description.length > 30
        ? route.description.slice(0, 30) + '…'
        : route.description;
    }
    return '包含该景点及其它精彩目的地';
  },

  onTapRelatedRoute: function (e) {
    var routeId = e.currentTarget.dataset.routeId;
    if (!routeId) return;
    wx.navigateTo({
      url: '/pages/route-detail/route-detail?id=' + routeId
    });
  },

  onAskAI() {
    const { attraction } = this.data;
    if (!attraction) return;

    wx.setStorageSync('qianxing_pending_context', {
      contextType: 'attraction',
      attractionId: attraction.id,
      attractionName: attraction.name,
      city: attraction.city || '',
      description: attraction.description || '',
      highlights: attraction.highlights || [],
      tips: attraction.tips || [],
      tags: attraction.tags || [],
      category: attraction.category || '',
      rating: attraction.rating || 0,
      price: attraction.price || '',
      duration: attraction.duration || ''
    });

    wx.switchTab({ url: '/pages/guide/guide' });
  },

  onShareAppMessage() {
    const { attraction } = this.data;
    if (!attraction) return { title: '景点详情' };

    return {
      title: `${attraction.name} - ${attraction.city}`,
      path: `/pages/scenic-detail/scenic-detail?id=${attraction.id}`
    };
  }
});
