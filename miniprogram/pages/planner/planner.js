const mock = require('../../utils/mock')

var auth = require('../../utils/auth')
Page({
  data: {
    interestTags: [],
    selectedTagIds: [],
    days: 3,
    budget: '舒适型',
    companion: '情侣/朋友',
    physicalLevel: '适中',
    pace: '均衡'
  },

  onShow() { if (!auth.requireLoginRedirect()) return },

  onLoad() {
    mock.getInterestTags().then(tags => {
      this.setData({
        interestTags: tags.map(t => ({ ...t, selected: false }))
      })
    })
  },

  toggleTag(e) {
    const id = e.currentTarget.dataset.id
    const selectedTagIds = this.data.selectedTagIds || []
    const nextSelectedIds = selectedTagIds.includes(id)
      ? selectedTagIds.filter(item => item !== id)
      : [...selectedTagIds, id]
    const nextTags = this.data.interestTags.map(item => ({
      ...item,
      selected: nextSelectedIds.includes(item.id)
    }))
    this.setData({
      selectedTagIds: nextSelectedIds,
      interestTags: nextTags
    })
  },

  setDays(e) { this.setData({ days: parseInt(e.currentTarget.dataset.val) }) },
  setBudget(e) { this.setData({ budget: e.currentTarget.dataset.val }) },
  setCompanion(e) { this.setData({ companion: e.currentTarget.dataset.val }) },
  setPhysical(e) { this.setData({ physicalLevel: e.currentTarget.dataset.val }) },
  setPace(e) { this.setData({ pace: e.currentTarget.dataset.val }) },

  handleSubmit() {
    if (this.data.selectedTagIds.length < 2) {
      wx.showToast({ title: '请至少选择2个兴趣标签', icon: 'none' })
      return
    }
    const selection = {
      selectedTagIds: this.data.selectedTagIds,
      days: this.data.days,
      budget: this.data.budget,
      companion: this.data.companion,
      physicalLevel: this.data.physicalLevel,
      pace: this.data.pace
    }
    wx.setStorageSync('qianxing_selection', selection)
    wx.navigateTo({ url: '/pages/profile/profile' })
  }
})
