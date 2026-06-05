App({
  globalData: {
    visitorSelection: null,
    visitorProfile: null,
    selectedRoute: null,
    myTrips: []
  },

  onLaunch() {
    const sel = wx.getStorageSync('qianxing_selection')
    if (sel) this.globalData.visitorSelection = sel
    const profile = wx.getStorageSync('qianxing_profile')
    if (profile) this.globalData.visitorProfile = profile
    const route = wx.getStorageSync('qianxing_selected_route')
    if (route) this.globalData.selectedRoute = route
    const trips = wx.getStorageSync('qianxing_trips')
    if (trips) this.globalData.myTrips = trips
  }
})
