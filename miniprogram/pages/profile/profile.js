const mock = require('../../utils/mock')

Page({
  data: { loading: true, selection: null, profile: null },

  onLoad() {
    const sel = wx.getStorageSync('qianxing_selection')
    if (!sel || sel.selectedTagIds.length < 2) {
      this.setData({ loading: false })
      wx.showToast({ title: '请先设置偏好', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    this.setData({ selection: sel })
    mock.generateProfile(sel).then(profile => {
      this.setData({ profile, loading: false })
      wx.setStorageSync('qianxing_profile', profile)
    })
  },

  getTagName(id) {
    const tag = mock.interestTags.find(t => t.id === id)
    return tag ? tag.name : id
  },

  goRecommend() { wx.navigateTo({ url: '/pages/recommend/recommend' }) },
  goBack() { wx.navigateBack() },
  goHome() { wx.switchTab({ url: '/pages/index/index' }) }
})
