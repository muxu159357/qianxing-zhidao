// pages/my-trips/my-trips.js
const app = getApp();

Page({
  data: {
    trips: []
  },

  onLoad() {
    this.loadTrips();
  },

  onShow() {
    // 每次显示时刷新，确保数据最新
    this.loadTrips();
  },

  loadTrips() {
    let trips = [];

    // 优先从 Storage 读取
    try {
      const stored = wx.getStorageSync('qianxing_trips');
      if (stored && Array.isArray(stored)) {
        trips = stored;
      }
    } catch (e) {
      console.warn('读取行程存储失败:', e);
    }

    // 备用：从 app.globalData 读取
    if ((!trips || trips.length === 0) && app && app.globalData && app.globalData.myTrips) {
      trips = app.globalData.myTrips;
    }

    // 确保每个 trip 有 id
    trips = trips.map((trip, index) => ({
      ...trip,
      id: trip.id || `trip_${index}_${Date.now()}`
    }));

    this.setData({ trips });
  },

  onTapTrip(e) {
    const id = e.currentTarget.dataset.id;
    const trip = this.data.trips.find(t => t.id === id);

    if (!trip) return;

    // 跳转到行程详情或路线页
    wx.navigateTo({
      url: `/pages/trip-detail/trip-detail?id=${id}`,
      fail() {
        // 如果 trip-detail 不存在，尝试跳转到路线
        wx.navigateTo({
          url: `/pages/route/route?id=${trip.routeId || id}`,
          fail() {
            wx.showToast({ title: '页面开发中', icon: 'none' });
          }
        });
      }
    });
  },

  onDeleteTrip(e) {
    const id = e.currentTarget.dataset.id;
    const trip = this.data.trips.find(t => t.id === id);

    wx.showModal({
      title: '确认删除',
      content: trip ? `确定要删除「${trip.routeName || trip.name || '该行程'}」吗？` : '确定要删除该行程吗？',
      confirmText: '删除',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          this.deleteTrip(id);
        }
      }
    });
  },

  deleteTrip(id) {
    let trips = this.data.trips.filter(t => t.id !== id);
    this.setData({ trips });

    // 同步到 Storage
    try {
      wx.setStorageSync('qianxing_trips', trips);
    } catch (e) {
      console.warn('保存行程失败:', e);
    }

    // 同步到 app.globalData
    if (app && app.globalData) {
      app.globalData.myTrips = trips;
    }

    wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
  },

  onGoExplore() {
    wx.switchTab({
      url: '/pages/index/index',
      fail() {
        wx.navigateBack();
      }
    });
  }
});
